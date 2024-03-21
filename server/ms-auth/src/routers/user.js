const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const multer = require('multer')
var { validateRequestBody } = require("zod-express-middleware");
var { z } = require("zod");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const {Op} = require("sequelize")
const { promisify } = require("util");
const fs = require("fs")


const { isAuth, checkPermission } = require("../middleware/auth");
const { converter } = require('../utils/converter')
const Inscription = require('../models/inscription')
const sequelize = require('../db/db_connection');
const InscripMinEtab = require('../models/inscripMinEtab');


const mkdirAsync = promisify(fs.mkdir);
const uploadsDir = "uploads/";
mkdirAsync(uploadsDir).catch(() => {});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      fs.mkdir('./uploads/',(err)=>{
      cb(null, './uploads/')
      })
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix.replace(/:/g, '-') + file.originalname)
  },
})

const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(pdf)/)) {
      return cb(new Error('File must be in pdf format!'))
  }

  cb(undefined, true)
}

const upload = multer({storage: storage, fileFilter: fileFilter})


//Create a new user(driver/client)
router.post("/register", 
  validateRequestBody(
    z.object({
        first_name: z.string(),
        last_name: z.string(),
        phone_number: z.string(),
        email: z.string(),
        password: z.string().min(8),
        address: z.string(),
        role: z.string(),
    })
  ), 
  async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const { first_name, last_name , phone_number , email , password, address , role } = req.body;

        const hash = bcrypt.hashSync(password, 10);
  
        await User.create({
          first_name, 
          last_name, 
          phone_number,
          address,
          email,
          password: hash,
          role,
          active: false
        }, {transaction: t}).then(async(response) => {
          //await createBlockchainAccount(response.dataValues.id, t)
          t.commit()
          const user = response.dataValues;
          const token = jwt.sign(
              {
                  id: user.id,
                  email: user.email,
              },
              process.env.JWT_SECRET ? process.env.JWT_SECRET : "KbPassword",
              {
                  expiresIn: "1d",
              }
          );
          res.cookie("token", token, {
              httpOnly: false,
              sameSite: "strict",
              secure: process.env.NODE_ENV === "production",
          });
        
          var userPv = user;
          delete userPv.password;
          delete userPv.deleted;
          req.user = userPv;
          console.log(userPv)
          res.status(201).send(userPv);
        }).catch(err => {
            t.rollback()
            console.log(err)
            res.status(400).send({ status: 400, message: err.errors });
        })
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
});

router.post("/evaluateur/", 
  isAuth,
  validateRequestBody(
    z.object({
        first_name: z.string(),
        last_name: z.string(),
        phone_number: z.string(),
        email: z.string(),
        password: z.string().min(8),
    })
  ), 
  async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const { first_name, last_name , phone_number , email , password} = req.body;

        const hash = bcrypt.hashSync(password, 10);
  
        await User.create({
          first_name, 
          last_name, 
          phone_number,
          email,
          password: hash,
          role: "evaluateur",
          contractantId: req.user.id
        }, {transaction: t}).then(async(response) => {
          //await createBlockchainAccount(response.dataValues.id, t)
          t.commit()
          res.status(201).send("evaluateur created");
        }).catch(err => {
            console.log(err)
            res.status(400).send({ status: 400, message: err.errors });
        })
    } catch (error) {
      t.rollback()
      res.status(500).send("Internal Server Error");
    }
});

router.get('/evaluateurs/', isAuth, async (req, res) => {
  try {
    const size = Number(req.query.size) || null
    const page = Number(req.query.page) || null
    const orders = JSON.parse(req.query?.sorts ?? "[]")
    const filts1 = JSON.parse(req.query?.filters ?? "[]")

    const filters = converter(filts1)

    const evaluateurs = await User.findAndCountAll({
      limit: size,
      offset: page * size,
      order: orders,
      where: {contractantId: req.user.id, deleted: false, ...filters}
    })
    res.status(200).send(evaluateurs)
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
})

router.delete('/evaluateurs/:id', isAuth, async (req, res) => {
  try {
    await User.update({deleted: true}, {where: {id: req.params.id}})
    res.status(200).send("user deleted")
  } catch (error) {
    res.status(500).send("Internal server error")
  }
})

router.post("/ministere/", 
  isAuth,
  upload.fields([
    { name: 'codeOrdonnateurFile', maxCount: 1 },
    { name: 'nisFile', maxCount: 1 },
    { name: 'nifFile', maxCount: 1 }
]),
  async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const {phone_number , email , password, nom, nis, nif, codeOrdonnateur} = req.body;
        const { nifFile, nisFile, codeOrdonnateurFile } = req.files;

        const hash = bcrypt.hashSync(password, 10);
  
        await User.create({
          phone_number,
          email,
          password: hash,
          role: "ministere",
        }, {transaction: t}).then(async(response) => {
          //await createBlockchainAccount(response.dataValues.id, t)
          await InscripMinEtab.create({
            nom,
            nif,
            nis,
            codeOrdonnateur,
            nifFile: nifFile[0].filename,
            nisFile: nisFile[0].filename,
            codeOrdonnateurFile: codeOrdonnateurFile[0].filename,
            userId: response.id,
          }, {transaction: t})
          t.commit()
          res.status(201).send("ministere created");
        }).catch(err => {
            console.log(err)
            t.rollback()
            res.status(400).send({ status: 400, message: err.errors });
        })
    } catch (error) {
      console.log(error);
      t.rollback()
      res.status(500).send("Internal Server Error");
    }
});

router.get('/ministeres/', isAuth, async (req, res) => {
  try {
    const size = Number(req.query.size) || null
    const page = Number(req.query.page) || null
    const orders = JSON.parse(req.query?.sorts ?? "[]")
    const filts1 = JSON.parse(req.query?.filters ?? "[]")

    const filters = converter(filts1)

    const ministeres = await User.findAndCountAll({
      limit: size,
      offset: page * size,
      order: orders,
      where: {role: "ministere", deleted: false, ...filters},
      include: InscripMinEtab
    })
    res.header("x-total-count", ministeres.count);
        res.header("Access-Control-Expose-Headers", "x-total-count");
    res.status(200).send(ministeres)
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
})

router.delete('/ministeres/:id', isAuth, async (req, res) => {
  try {
    await User.update({deleted: true}, {where: {id: req.params.id}})
    res.status(200).send("user deleted")
  } catch (error) {
    res.status(500).send("Internal server error")
  }
})

router.post("/etab/", 
  isAuth,
  upload.fields([
    { name: 'codeOrdonnateurFile', maxCount: 1 },
    { name: 'nisFile', maxCount: 1 },
    { name: 'nifFile', maxCount: 1 }
]),
  async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const {phone_number , email , password, nom, nis, nif, codeOrdonnateur} = req.body;
        const { nifFile, nisFile, codeOrdonnateurFile } = req.files;
        const hash = bcrypt.hashSync(password, 10);
  
        await User.create({
          phone_number,
          email,
          password: hash,
          role: "etablissement",
        }, {transaction: t}).then(async(response) => {
          //await createBlockchainAccount(response.dataValues.id, t)
          await InscripMinEtab.create({
            nom,
            nif,
            nis,
            codeOrdonnateur,
            nifFile: nifFile[0].filename,
            nisFile: nisFile[0].filename,
            codeOrdonnateurFile: codeOrdonnateurFile[0].filename,
            userId: response.id,
            ministereId: req.user.id
          }, {transaction: t})
          t.commit()
          res.status(201).send("etablissement created");
        }).catch(err => {
            t.rollback()
            console.log(err)
            res.status(400).send({ status: 400, message: err.errors });
        })
    } catch (error) {
      t.rollback()
      res.status(500).send("Internal Server Error");
    }
});

router.get('/etabs/', isAuth, async (req, res) => {
  try {
    const size = Number(req.query.size) || null
    const page = Number(req.query.page) || null
    const orders = JSON.parse(req.query?.sorts ?? "[]")
    const filts1 = JSON.parse(req.query?.filters ?? "[]")

    const filters = converter(filts1)

    const etablissements = await User.findAndCountAll({
      limit: size,
      offset: page * size,
      order: orders,
      where: {role: "etablissement", deleted: false, ...filters},
    })
    res.status(200).send(etablissements)
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
})

router.get('/mes_etabs/', isAuth, async (req, res) => {
  try {
    const size = Number(req.query.size) || null
    const page = Number(req.query.page) || null
    const orders = JSON.parse(req.query?.sorts ?? "[]")
    const filts1 = JSON.parse(req.query?.filters ?? "[]")

    const filters = converter(filts1)

    const etablissements = await User.findAndCountAll({
      limit: size,
      offset: page * size,
      order: orders,
      where: {role: "etablissement", deleted: false, ...filters},
      include: {model: InscripMinEtab, where: {ministereId: req.user.id}}
    })
    res.status(200).send(etablissements)
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
})

router.delete('/etabs/:id', isAuth, async (req, res) => {
  try {
    await User.update({deleted: true}, {where: {id: req.params.id}})
    res.status(200).send("user deleted")
  } catch (error) {
    res.status(500).send("Internal server error")
  }
})

router.get('/user/:id', isAuth, async (req, res) => {
  try {
    const user = await User.findOne({where: {id: req.params.id}, include: Inscription})
    res.status(200).send(user)
  } catch (error) {
    res.status(500).send("Internal server error")
  }
})

router.get('/', isAuth, async (req, res) => {
  try {
    const size = Number(req.query.size) || null
    const page = Number(req.query.page) || null
    const orders = JSON.parse(req.query?.sorts ?? "[]")
    const filts1 = JSON.parse(req.query?.filters ?? "[]")

    const filters = converter(filts1)

    const users = await User.findAndCountAll({
      limit: size,
      offset: page * size,
      order: orders,
      where: {
        ...filters,
        active: false,
        role: {[Op.or]: ['contractant','soumissionnaire']},
        '$inscription.complet$': true
      }, 
      include: Inscription
    })
    res.status(200).send(users)
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error")
  }
})

router.post("/login",
  validateRequestBody(
    z.object({
      email: z.string(),
      password: z.string()
    })
  ),
  async (req, res) => {
    try {
        const { email } = req.body;
        const result = await User.findOne({ where: { email, deleted: false } });
        
        if (!result) {
            return res.status(401).json({ status: 401, message: "Email or password are incorrect!" });
        }
        
        const user = result.dataValues;
        const password = req.body.password;

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ status: 401, message: "Email or password are incorrect!" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET ? process.env.JWT_SECRET : "KbPassword",
            {
                expiresIn: "1d",
            }
        );
        
        res.cookie("token", token, {
            httpOnly: false,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        var userPv = user;
        delete userPv.password;
        delete userPv.deleted;
        req.user = userPv;
        res.status(200).send(userPv);
    } catch (error) {
        return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
});

router.get("/isAuth", isAuth, async (req, res) => {
    try {
      let user = req.user;
      res.status(200).send(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
});

router.get("/logout", isAuth, (_req, res) => {
    try {
      res.clearCookie("token");
      res.status(200).json({ status: 200, message: "OK" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
});

router.patch("/activate/:id", isAuth, async(req, res) => {
  try {
    await User.update({active: true}, {where: {id: req.params.id}})
    res.status(200).send("User active")
  } catch (error) {
    res.status(500).send("Internal server error")
  }
})

router.patch("/reject/:id", isAuth, async(req, res) => {
  try {
    await Inscription.update({complet: false}, {where: {userId: req.params.id}})
    res.status(200).send("User rejected")
  } catch (error) {
    res.status(500).send("Internal server error")
  }
})

router.patch("/deactivate/:id", isAuth, async(req, res) => {
  const t = await sequelize.transaction()
  try {
    await User.update({active: false}, {where: {id: req.params.id}, transaction: t})
    await Inscription.update({complet: false}, {where: {userId: req.params.id}, transaction: t})
    res.status(200).send("User rejected")
  } catch (error) {
    res.status(500).send("Internal server error")
  }
})

router.patch("/me", isAuth, async(req, res) => {
  try {
    await User.update({...req.body}, {where: {id: req.user.id}})
    res.status(200).send("User updated")
  } catch (error) {
    res.status(500).send("Internal server error")
  }
})

router.patch('/password/me', isAuth, async(req, res) => {
  try {
    console.log(req.body);
    const result = await User.findOne({ where: { id: req.user.id, deleted: false } });
    const user = result.dataValues;
    const password = req.body.password
    
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    
    if (!isPasswordCorrect) {
        return res.status(401).json({ status: 401, message: "Email or password are incorrect!" });
    }

    const hash = bcrypt.hashSync(req.body.newPassword, 10);
    console.log(hash);
    await User.update({password: hash}, {where: {id: req.user.id}})
    res.status(200).send("User updated")
  } catch (error) {
    res.status(500).send("Internal server error")
  }
})

module.exports = router