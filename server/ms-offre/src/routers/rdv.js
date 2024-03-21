const express = require('express')
const router = express.Router()
const Rdv = require('../models/rdv')
const Lot = require('../models/lot')
const User = require('../models/user')
const {converter} = require("../utils/converter")
const Notification = require('../models/notification')
const NotificationUser = require('../models/notificationUser')
const { isAuth } = require('../middleware/auth')
const fs = require('fs')
const Web3 = require('web3')
const sequelize = require('../db/db_connection')
const path = require('path')
const Offre = require('../models/offre')

const web3 = new Web3('http://41.111.227.13:7545');


const contractAbi = JSON.parse(fs.readFileSync(path.join(__dirname,'../../Soumission_sol_Submissions.abi')).toString());

let contract = new web3.eth.Contract(contractAbi, '0x46357674DE68Ad7B3603b874A12D7658021F27d2');
    // You can now use the Contract instance to interact with the contract
let accounts 
web3.eth.getAccounts().then(res => accounts = res)

router.post('/', isAuth, async (req,res) => {
    const t = await sequelize.transaction()
    try{
        await Rdv.create({
            date: req.body.date,
            hour: req.body.hour,
            adresse: req.body.adresse,
            offreId: req.body.offreId,
            userId: req.user.id
        }, {transaction: t})

        const offre = await Offre.findOne({where: {id: req.body.offreId}, include: Lot, transaction: t})

        await Notification.create({
            type: "rdv créé",
            titre: "Rendez-vous",
            contenu: `${offre.dataValues.name}, la date: ${req.body.date}, ${req.body.hour}`
        }, {transaction: t}).then(async(response) => {
            for (let lot of offre.dataValues.lots) {
                const lotSubmissions = await contract.methods
                    .getSubmissionsByLotId(lot.id)
                    .call({ from: accounts[2] });
                const result = transformData(lotSubmissions)
                
                for (let r of result) {
                    await NotificationUser.create({
                        userId: r.owner,
                        notificationId: response.id
                    }, {transaction: t})
                }
            }
            
        })
        t.commit()
        res.status(201).send("rdv created")
    } catch(e) {
        t.rollback()
        console.log(e);
        res.status(500).send(e)
    }
})

router.patch('/:id', isAuth, async (req,res) => {
    const t = await sequelize.transaction()
    try{
        await Rdv.update({
            date: req.body.date,
            hour: req.body.hour,
            adresse: req.body.adresse,
            offreId: req.body.offreId,
        }, {where: {id: req.params.id}, transaction: t})

        const offre = await Offre.findOne({where: {id: req.body.offreId}, include: Lot, transaction: t})

        await Notification.create({
            type: "rdv modifié",
            titre: "Rendez-vous",
            contenu: `${offre.dataValues.name}, la date: ${req.body.date}, ${req.body.hour}`
        }, {transaction: t}).then(async(response) => {
            for (let lot of offre.dataValues.lots) {
                const lotSubmissions = await contract.methods
                    .getSubmissionsByLotId(lot.id)
                    .call({ from: accounts[2] });
                const result = transformData(lotSubmissions)
                
                for (let r of result) {
                    NotificationUser.create({
                        userId: r.owner,
                        notificationId: response.id
                    }, {transaction: t})
                }
            }
        })

        res.status(200).send("rdv updated")
    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/cancel/:id', isAuth, async (req,res) => {
    const t = await sequelize.transaction()
    try{
        await Rdv.update({
            state: "Annulé",
        }, {where: {id: req.params.id}, transaction: t})

        const offre = await Offre.findOne({where: {id: req.body.offreId}, transaction: t})

        await Notification.create({
            type: "rdv modifié",
            titre: "Rendez-vous",
            contenu: `${offre.dataValues.name}, la date: ${req.body.date}, ${req.body.hour}`
        }, {transaction: t}).then(async(response) => {
            for (let lot of offre.dataValues.lots) {
                const lotSubmissions = await contract.methods
                    .getSubmissionsByLotId(lot.id)
                    .call({ from: accounts[2] });
                const result = transformData(lotSubmissions)
                
                for (let r of result) {
                    NotificationUser.create({
                        userId: r.owner,
                        notificationId: response.id
                    }, {transaction: t})
                }
            }
        })
        t.commit()
        res.status(200).send("rdv updated")
    } catch(e) {
        t.rollback()
        res.status(500).send(e)
    }
})

router.get("/", isAuth, async(req, res) => {
    try{
        const size = Number(req.query.size) || null
        const page = Number(req.query.page) || null
        const orders = JSON.parse(req.query?.sorts ?? "[]")
        const filts1 = JSON.parse(req.query?.filters ?? "[]")

        const filters = converter(filts1)

        const rdvs = await Rdv.findAndCountAll({
            limit: size,
            offset: page * size,
            order: [...orders, ["createdAt", "DESC"]],
            where: {
                userId: req.user.id,
                ...filters
            },
            include: Offre
        })
        res.header("x-total-count", rdvs.count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).send(rdvs)
    } catch(e) {
        console.log(e);
        res.status(500).send(e)
    }
})

function transformData(data) {
    const transformed = data.map(item => {
      return {
        id: item[0],
        srb: item[1],
        state: (item[2] == 0) ? "en attente" : (item[2] == 1) ? "evaluée" : (item[2] == 2) ? "fermée": null,
        infos: {
          budget: item[3][0],
          delai: item[3][1],
          garantie: item[3][2],
          materiels: item[3][3],
          employes: item[3][4],
          cahierDesCharges: item[3][5]
        },
        owner: item[4],
        lotId: item[5],
        dateDepot: item[6],
        addresses: {
          offreOwnerAddress: item[7][0],
          evaluateurAddress: item[7][1],
          ownerAddress: item[7][2],
          adminAddress: item[7][3]
        },
        evaluation: {
          materiels: item[8][0],
          employes: item[8][1],
          qualTech: item[8][2]
        }
      };
    });
  
    return transformed;
}

module.exports = router
