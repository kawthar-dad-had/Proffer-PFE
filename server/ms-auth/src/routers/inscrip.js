const express = require('express')
const router = new express.Router()
const Inscription = require('../models/inscription')
const multer = require('multer')
//const {sendCode} = require('../emails/forgotPassword')
const { promisify } = require("util");
const fs = require("fs")

const { isAuth, checkPermission } = require("../middleware/auth");

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
router.post("/", 
  isAuth, 
  /*checkPermission('contractant'), checkPermission('soumissionnaire'),*/ upload.fields([
    { name: 'numRegistreFile', maxCount: 1 },
    { name: 'classificationFile', maxCount: 1 },
    { name: 'codesFile', maxCount: 1 },
    { name: 'cacobatphFile', maxCount: 1 },
    { name: 'casnosFile', maxCount: 1 },
    { name: 'nisFile', maxCount: 1 },
    { name: 'nifFile', maxCount: 1 }
]),
  async (req, res) => {
    try {
        const { 
            nom,
            type,
            numRegistre,
            classification,
            codes,
            nif,
            nis,
            casnos,
            cacobatph
        } = req.body;
        const { numRegistreFile, classificationFile, codesFile, nifFile, nisFile, casnosFile, cacobatphFile } = req.files;


        await Inscription.create({
            nom,
            type,
            numRegistre, numRegistreFile: numRegistreFile[0].filename,
            classification, classificationFile: classificationFile[0].filename,
            nif, nifFile: nifFile[0].filename,
            nis, nisFile: nisFile[0].filename,
            casnos, casnosFile: casnosFile[0].filename,
            cacobatph, cacobatphFile: cacobatphFile[0].filename,
            complet: true,
            userId: req.user.id
        }).then(() => {
          return res.status(201).send({ status: 201, message: "Inscription created" });
        }).catch(err => {
            res.status(400).send({ status: 400, message: err.errors });
        })
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
});

router.post("/save", 
  isAuth, 
  /*checkPermission('contractant'), checkPermission('soumissionnaire'),*/ upload.fields([
    { name: 'numRegistreFile', maxCount: 1 },
    { name: 'classificationFile', maxCount: 1 },
    { name: 'codesFile', maxCount: 1 },
    { name: 'cacobatphFile', maxCount: 1 },
    { name: 'casnosFile', maxCount: 1 },
    { name: 'nisFile', maxCount: 1 },
    { name: 'nifFile', maxCount: 1 }
]),
  async (req, res) => {
    try {
        const { 
            nom,
            type,
            numRegistre,
            classification,
            codes,
            nif,
            nis,
            casnos,
            cacobatph
        } = req.body;
        
        const { numRegistreFile, classificationFile, codesFile, nifFile, nisFile, casnosFile, cacobatphFile } = req.files;

        const inscription = {
          numRegistreFile: numRegistreFile ? numRegistreFile[0].filename : null,
          classificationFile: classificationFile ? classificationFile[0].filename : null,
          nifFile: nifFile ? nifFile[0].filename : null,
          nisFile: nisFile ? nisFile[0].filename : null,
          casnosFile: casnosFile ? casnosFile[0].filename : null,
          cacobatphFile: cacobatphFile ? cacobatphFile[0].filename : null,
        };

        await Inscription.create({
            nom,
            type,
            numRegistre, numRegistreFile: inscription.numRegistreFile,
            classification, classificationFile: inscription.classificationFile,
            nif, nifFile: inscription.nifFile,
            nis, nisFile: inscription.nisFile,
            casnos, casnosFile: inscription.casnosFile,
            cacobatph, cacobatphFile: inscription.cacobatphFile,
            complet: false,
            userId: req.user.id
        }).then(() => {
          return res.status(201).send({ status: 201, message: "Inscription created" });
        }).catch(err => {
            res.status(400).send({ status: 400, message: err.errors });
        })
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
});

router.put("/:id", 
  isAuth, 
  /*checkPermission('contractant'), checkPermission('soumissionnaire'),*/ upload.fields([
    { name: 'numRegistreFile', maxCount: 1 },
    { name: 'classificationFile', maxCount: 1 },
    { name: 'codesFile', maxCount: 1 },
    { name: 'cacobatphFile', maxCount: 1 },
    { name: 'casnosFile', maxCount: 1 },
    { name: 'nisFile', maxCount: 1 },
    { name: 'nifFile', maxCount: 1 }
]),
  async (req, res) => {
    try {
        const insc = await Inscription.findOne({
            where: {id: req.params.id}
        })
        const { 
            nom,
            type,
            numRegistre,
            classification,
            codes,
            nif,
            nis,
            casnos,
            cacobatph,
        } = req.body;
        const { numRegistreFile, classificationFile, codesFile, nifFile, nisFile, casnosFile, cacobatphFile } = req.files;


        await Inscription.update({
          nom,
          type,
          numRegistre, numRegistreFile: numRegistreFile ? numRegistreFile[0].filename : insc.numRegistreFile,
          classification, classificationFile: classificationFile ? classificationFile[0].filename : insc.classificationFile,
          nif, nifFile: nifFile ? nifFile[0].filename : insc.nisFile,
          nis, nisFile: nisFile ? nisFile[0].filename : insc.nifFile,
          casnos, casnosFile: casnosFile ? casnosFile[0].filename : insc.casnosFile,
          cacobatph, cacobatphFile: cacobatphFile ? cacobatphFile[0]?.filename : insc.cacobatphFile,
          complet: true,
          userId: req.user.id
        }, {where: {id: req.params.id}}).then(() => {
          return res.status(200).send({ status: 200, message: "Inscription updated" });
        }).catch(err => {
            res.status(400).send({ status: 400, message: err.errors });
        })
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
});

router.put("/save/:id", 
  isAuth, 
  /*checkPermission('contractant'), checkPermission('soumissionnaire'),*/ upload.fields([
    { name: 'numRegistreFile', maxCount: 1 },
    { name: 'classificationFile', maxCount: 1 },
    { name: 'codesFile', maxCount: 1 },
    { name: 'cacobatphFile', maxCount: 1 },
    { name: 'casnosFile', maxCount: 1 },
    { name: 'nisFile', maxCount: 1 },
    { name: 'nifFile', maxCount: 1 }
]),
  async (req, res) => {
    try {
        const insc = await Inscription.findOne({
            where: {id: req.params.id}
        })
        const { 
            nom,
            type,
            numRegistre,
            classification,
            codes,
            nif,
            nis,
            casnos,
            cacobatph
        } = req.body;
        const { numRegistreFile, classificationFile, codesFile, nifFile, nisFile, casnosFile, cacobatphFile } = req.files;


        await Inscription.update({
            nom,
            type,
            numRegistre, numRegistreFile: numRegistreFile ? numRegistreFile[0].filename : insc.numRegistreFile,
            classification, classificationFile: classificationFile ? classificationFile[0].filename : insc.classificationFile,
            nif, nifFile: nifFile ? nifFile[0].filename : insc.nisFile,
            nis, nisFile: nisFile ? nisFile[0].filename : insc.nifFile,
            casnos, casnosFile: casnosFile ? casnosFile[0].filename : insc.casnosFile,
            cacobatph, cacobatphFile: cacobatphFile ? cacobatphFile[0]?.filename : insc.cacobatphFile,
            complet: false,
            userId: req.user.id
        }, {where: {id: req.params.id}}).then(() => {
          return res.status(200).send({ status: 200, message: "Inscription updated" });
        }).catch(err => {
            res.status(400).send({ status: 400, message: err.errors });
        })
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
});

router.get("/:id", 
  isAuth, 
  /*checkPermission('contractant'), checkPermission('soumissionnaire'),*/
  async (req, res) => {
    try {
      const insc = await Inscription.findOne({
          where: {userId: req.params.id}
      })
      return res.status(200).send(insc)
        
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
});

module.exports = router