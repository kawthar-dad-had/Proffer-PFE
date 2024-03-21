const express = require('express')
const router = express.Router()
const Offre = require('../models/offre')
const Lot = require('../models/lot')
const sequelize = require('../db/db_connection')
const {converter, transformData} = require("../utils/converter")
const multer = require('multer')
const { promisify } = require("util");
const fs = require("fs");
const { isAuth } = require('../middleware/auth')
const User = require('../models/user')
const NotificationUser = require('../models/notificationUser')
const Notification = require('../models/notification')
const Web3 = require('web3')
const path = require('path')
const Inscription = require('../models/inscription')
const InscripMinEtab = require('../models/inscripMinEtab')
const {Op} = require('sequelize')
const { error } = require('console')

const web3 = new Web3('http://41.111.227.13:7545');


const contractAbi = JSON.parse(fs.readFileSync(path.join(__dirname,'../../Soumission_sol_Submissions.abi')).toString());

let contract = new web3.eth.Contract(contractAbi, '0x46357674DE68Ad7B3603b874A12D7658021F27d2');
    // You can now use the Contract instance to interact with the contract
let accounts 
web3.eth.getAccounts().then(res => accounts = res)

const mkdirAsync = promisify(fs.mkdir);
const uploadsDir = "uploads/";
mkdirAsync(uploadsDir).catch(() => {});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const name = req.body.name ? req.body.name.replace(/\s/g, "") : "unknown";
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + 
              "-" + name.replace(/\s/g, "") + "." + 
              file.originalname.split(".")[file.originalname.split(".").length - 1]
      );
    },
  });

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(pdf)$/)) {
            return cb(new Error('Please upload a pdf'))
        }
        cb(undefined, true)

    },
    storage
})

router.post('/', isAuth, upload.single('cahierDesCharges'), async (req,res) => {
    const t = await sequelize.transaction()
    try{
        const lots = JSON.parse(req.body.lots)
        console.log(lots);
        await Offre.create({
            name: req.body.name,
            dDay: req.body.dDay,
            description: req.body.description,
            ville: req.body.ville,
            evaluateurId: req.body.evaluateurId,
            cahierDesCharges: req.file.filename,
            userId: req.user.id
        }, {transaction: t}).then(async(response) => {
            for (let l of lots) {
                await Lot.create({
                    name: l.name,
                    domaine: l.domaine,
                    materiels: l.materiels,
                    employes: l.employes,
                    budget: l.budget,
                    delai: l.delai,
                    garantie: l.garantie,
                    qualTech: l.qualTech,
                    offreId: response.id
                }, {transaction: t}).then(async (response) => {
                    t.commit()
                    res.status(201).send("offer created")
                })
            }
        })
        //producemanel({message: offer, propertie: "postoffre"})
    } catch(e) {
        t.rollback()
        res.status(500).send(e)
	    console.log(e)
    }
})

router.delete('/:id', isAuth, async (req, res) => {
    const t = await sequelize.transaction()
    try {
        await Lot.destroy({where: {offreId: req.params.id}, transaction: t})
        await Offre.destroy({where: {id: req.params.id}, transaction: t})
        t.commit()
        res.status(200).send("offre deleted")
    } catch (error) {
        t.rollback()
        res.status(500).send(error)
    }
})

router.get('/auto/complete',async (req,res) => {
    try{
        const offres = await Offre.findAll({
            attributes: ['name'],
        })

        return res.status(200).send(offres)
    } catch(e) {
        console.log(e);
        res.status(500).send("internal server error")
    }
})

router.get('/lots/auto/complete',async (req,res) => {
    try{
        const offres = await Offre.findAll({
            attributes: ['name', 'id'],
            where: {state: "Terminé"}
        })

        return res.status(200).send(offres)
    } catch(e) {
        console.log(e);
        res.status(500).send("internal server error")
    }
})

router.get('/results/lots/auto/complete/:id',async (req,res) => {
    try{
        const lots = await Lot.findAll({
            attributes: ['name', 'id'],
            where: { offreId:req.params.id }
        })
        
        return res.status(200).send(lots)
    } catch(e) {
        console.log(e);
        res.status(500).send("internal server error")
    }
})

router.get('/', isAuth, async (req,res) => {
    try{
        const size = Number(req.query.size) || null
        const page = Number(req.query.page) || null
        const orders = JSON.parse(req.query?.sorts ?? "[]")
        const filts1 = JSON.parse(req.query?.filters ?? "[]")

        const filters = converter(filts1)

        const offers = await Offre.findAndCountAll({
            limit: size,
            offset: page * size,
            order: orders,
            where: {
                ...filters,
                state: "En attente"
            },
            include: [{model: User, as:'evaluateur'}, {model: User, include: {model: Inscription, required: true}, required: true}],
            distinct: true
        })
        console.log(offers);
        res.status(200).send(offers)
    } catch(e) {
        console.log(e);
        res.status(500).send("internal server error")
    }
})

router.get('/lots/:id', isAuth, async (req,res) => {
    try{
        const size = Number(req.query.size) || null
        const page = Number(req.query.page) || null
        const orders = JSON.parse(req.query?.sorts ?? "[]")
        const filts1 = JSON.parse(req.query?.filters ?? "[]")

        const filters = converter(filts1)

        const lots = await Lot.findAndCountAll({
            limit: size,
            offset: page * size,
            order: orders,
            where: {
                ...filters,
                offreId: req.params.id
            },
        })
        res.header("x-total-count", lots.count);
        res.header("Access-Control-Expose-Headers", "x-total-count");
        
        res.status(200).send(lots)
    } catch(e) {
        console.log(e);
        res.status(500).send("internal server error")
    }
})

router.get('/details/:id', isAuth, async (req,res) => {
    try{
        const size = Number(req.query.size) || null
        const page = Number(req.query.page) || null
        const orders = JSON.parse(req.query?.sorts ?? "[]")
        const filts1 = JSON.parse(req.query?.filters ?? "[]")

        const filters = converter(filts1)

        const lots = await Lot.findAndCountAll({
            limit: size,
            offset: page * size,
            order: orders,
            where: {
                ...filters,
                offreId: req.params.id
            },
            include: {model: Offre, include: {model: User, as: "evaluateur"}}
        })
        res.header("x-total-count", lots.count);
        res.header("Access-Control-Expose-Headers", "x-total-count");
        
        res.status(200).send(lots)
    } catch(e) {
        console.log(e);
        res.status(500).send("internal server error")
    }
})

router.get('/mes_etabs/offres', isAuth, async (req,res) => {
    try{
        const size = Number(req.query.size) || null
        const page = Number(req.query.page) || null
        const orders = JSON.parse(req.query?.sorts ?? "[]")
        const filts1 = JSON.parse(req.query?.filters ?? "[]")

        const filters = converter(filts1)

        const offers = await Offre.findAndCountAll({
            limit: size,
            offset: page * size,
            order: orders,
            where: {
                ...filters,
            },
            include: [Lot, {model: User, include: {model: InscripMinEtab, where: {ministereId: req.user.id}, required: true}, required: true}],
            distinct: true
        })

        res.status(200).send(offers)
    } catch(e) {
        console.log(e);
        res.status(500).send("internal server error")
    }
})

router.get('/mes_offres', isAuth, async (req,res) => {
    try{
        const size = Number(req.query.size) || null
        const page = Number(req.query.page) || null
        const orders = JSON.parse(req.query?.sorts ?? "[]")
        const filts1 = JSON.parse(req.query?.filters ?? "[]")

        const filters = converter(filts1)

        const offers = await Offre.findAndCountAll({
            limit: size,
            offset: page * size,
            order: orders,
            where: {
                ...filters,
                userId: req.user.id
            },
            include: Lot,
            distinct: true
        })
        res.status(200).send(offers)
    } catch(e) {
        console.log(e);
        res.status(500).send("internal server error")
    }
})

router.get('/mes_offres/lots', isAuth, async (req,res) => {
    try{
        const size = Number(req.query.size) || null
        const page = Number(req.query.page) || null
        const orders = JSON.parse(req.query?.sorts ?? "[]")
        const filts1 = JSON.parse(req.query?.filters ?? "[]")

        const filters = converter(filts1)

        const offers = await Lot.findAndCountAll({
            limit: size,
            offset: page * size,
            order: orders,
            where: {
                ...filters,
                "$offre.userId$": req.user.id
            },
            include: Offre,
            distinct: true
        })
        res.header("x-total-count", offers.count);
        res.header("Access-Control-Expose-Headers", "x-total-count");
        res.status(200).send(offers)
    } catch(e) {
        console.log(e);
        res.status(500).send("internal server error")
    }
})

router.get('/mes_offres/evaluateur/lots', isAuth, async (req,res) => {
    try{
        const size = Number(req.query.size) || null
        const page = Number(req.query.page) || null
        const orders = JSON.parse(req.query?.sorts ?? "[]")
        const filts1 = JSON.parse(req.query?.filters ?? "[]")

        const filters = converter(filts1)

        const offers = await Lot.findAndCountAll({
            limit: size,
            offset: page * size,
            order: orders,
            where: {
                ...filters,
                "$offre.evaluateurId$": req.user.id
            },
            include: Offre,
            distinct: true
        })
        res.status(200).send(offers)
    } catch(e) {
        console.log(e);
        res.status(500).send("internal server error")
    }
})

router.get('/:id', isAuth,async (req,res) => {
    try{
        const offer = await Offre.findOne({
            where: {
                id: req.params.id
            },
            include: {model: Lot, include: Bareme}
        })
        res.status(200).send(offer)
    } catch(e) {
        res.status(500).send("internal server error")
    }
})

router.get('/lot/bareme/:id', isAuth, async (req,res) => {
    try{
        const lot = await Lot.findOne({
            where: {
                id: req.params.id
            },
            include: [{model: Offre, include:{model: User, as: "evaluateur"}}],
        })
        
        res.status(200).send(lot)
    } catch(e) {
        console.log(e);
        res.status(500).send("internal server error")
    }
})

router.patch('/:id', isAuth, async(req,res) =>{
    const t = await sequelize.transaction()
    try {
        console.log("here");
        const offre = await Offre.findOne({ where: {id: req.params.id, userId: req.user.id }})
        if (!offre) {
            return res.status(404).send()
        }
        await Lot.update({state: "Annulé"}, {where: {id: req.params.id}, transaction: t})
        await Offre.update({state: "Annulé"}, {where: {id: req.params.id}, transaction: t})
        
        for (let l of offre.lots) {
            await Notification.create({
                type: "lot annulé",
                titre: "Lot",
                contenu: l.name
            }, {transaction: t}).then(async(response) => {
                const lotSubmissions = await contract.methods
                    .getSubmissionsByLotId(l.id)
                    .call({ from: accounts[2] });
                const result = transformData(lotSubmissions)

                for (let r of result) {
                    NotificationUser.create({
                        userId: r.owner,
                        notificationId: response.id
                    }, {transaction: t})
                }
            })    
        }


        t.commit()
        res.status(200).send("offer updated")

    } catch (e) {
        t.rollback()
        console.log(e);
        res.status(500).send("Internal server error")
    }
})

router.patch('/dashboard/:id', isAuth, async(req,res) =>{
    const t = await sequelize.transaction()
    try {
        const offre = await Offre.findOne({where: { id: req.params.id} })
        if (!offre) {
            return res.status(404).send()
        }
        await Offre.update({state: req.body.state}, {where: {id: req.params.id}, transaction: t})
        await Lot.update({state: req.body.state}, {where: {offreId: req.params.id}, transaction: t})
        
        if(req.body.state === "Approuvé") {
            await Notification.create({
                type: "offre approuvée",
                titre: "Offre",
                contenu: offre.name
            }, {transaction: t}).then(async response => {
                await NotificationUser.create({
                    notificationId: response.id,
                    userId: offre.userId
                }, {transaction: t})
            })
        } else if(req.body.state === "Non Approuvé") {
            await Notification.create({
                type: "offre refusée",
                titre: "Offre",
                contenu: offre.name
            }, {transaction: t}).then(async response => {
                await NotificationUser.create({
                    notificationId: response.id,
                    userId: offre.userId
                }, {transaction: t})
            })
        }
        
        t.commit()

        res.status(200).send("offer updated")

    } catch (e) {
        t.rollback()
        res.status(500).send("Internal server error")
    }
})

router.patch('/dashboard/lot/:id', isAuth, async(req,res) =>{
    const t = await sequelize.transaction()
    try {
        console.log("here");
        const lot = await Lot.findOne({where: { id: req.params.id}, include: Offre})
        if (!lot) {
            return res.status(404).send()
        } else {
            await Lot.update({completed: true}, {where: {id: req.params.id}, transaction: t})
            
            const lots = await Lot.findAll({where: {offreId: lot.dataValues.offreId}, transaction: t})
            
            const allCompleted = lots.every(item => item.completed === true);

            if (allCompleted) {
                await Offre.update({state: "Terminé"}, {where: {id: lot.dataValues.offreId}, transaction: t})
                await Notification.create({
                    type: "lot evalué",
                    titre: "Offre",
                    contenu: lot.dataValues.offre.name
                }, {transaction: t}).then(async response => {
                    await NotificationUser.create({
                        notificationId: response.id,
                        userId: lot.dataValues.offre.userId
                    }, {transaction: t})
                })
            }
            t.commit()

            return res.status(200).send("lot updated")
        }

    } catch (e) {
        t.rollback()
        console.log(e);
        res.status(500).send("Internal server error")
    }
})
module.exports = router
