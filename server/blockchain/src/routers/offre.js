const express = require('express')
const router = express.Router()
const Offre = require('../models/offre')
const Lot = require('../models/lot')
const User = require('../models/user')
const { Op } = require('sequelize')
const { isAuth } = require('../middleware/auth')
const Inscription = require('../models/inscription')
const {converter} = require('../utils/converter')

const InscripMinEtab = require('../models/inscripMinEtab')

router.get('/', isAuth,async (req,res) => {
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
                ...filters
            },
            include: Lot
        })
        res.status(200).send(offers)
    } catch(e) {
        console.log(e);
        res.status(500).send("internal server error")
    }
})
router.get('/:id', isAuth, async (req,res) => {
    try{
        const offer = await Offre.findOne({
            where: {
                id: req.params.id
            },
            include: {model: Lot}
        })
        res.status(200).send(offer)
    } catch(e) {
        res.status(500).send("internal server error")
    }
})

router.get('/lots/all', isAuth,async (req,res) => {
    try{
        const start = Number(req?.query?._start ?? 0) || null
        const end = Number(req?.query?._end ?? 0) || null
        const nom_like = req.query.nom_like || ''
        const ville_like = req.query.ville_like || ''
        const domaine = req.query.domaine || ''
        const filters = []

        if(nom_like != '') filters['name'] = { [Op.substring]: nom_like }
        if(ville_like != '') filters['ville'] = { [Op.substring]: ville_like }
        if(domaine.length > 0) filters['$lot.domaine$'] = { [Op.in]: typeof(domaine) == 'string' ? [domaine] : domaine }

        const offres = await Offre.findAndCountAll({
            limit: parseInt(end - start),
            offset: parseInt(((end/(end-start))-1 )*(end-start)),
            where: {
                ...filters,
                dDay: {[Op.gt]: new Date()},
                state: "Approuvé"
            },
            include: {model: User, include: [Inscription, InscripMinEtab]}
        })
	console.log(offres)
        const favs = await User.findOne({ where: { id: req.user.id }, include: {model: Offre}})

        const favorites = favs.offres    
        
        for (let i = 0; i < offres.rows.length; i++) {
            //console.log(lots[i].category);
            let isFavorite = favorites.some(favorite => favorite.id === offres.rows[i].id);
            offres.rows[i].dataValues.favorite = isFavorite;
        }

        res.header("x-total-count", offres.count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        return res.status(200).send(offres.rows)
    } catch(e) {
        console.log(e);
        res.status(500).send("internal server error")
    }
})

router.get('/auto/complete',async (req,res) => {
    try{
        const lots = await Offre.findAll({
            where: {
                dernierDelai: {[Op.gt]: new Date()}
            },
            attributes: ['name'],
            include: {model: Offre, where: {state: "Approuvé"}, required: true, attributes: []}
        })

        return res.status(200).send(lots)
    } catch(e) {
        console.log(e);
        res.status(500).send("internal server error")
    }
})

router.get('/auto/complete/offres',async (req,res) => {
    try{
        const lots = await Offre.findAll({
            where: {
                dDay: {[Op.gt]: new Date()},
                state: "Approuvé"
            },
            attributes: ['name'],
        })

        return res.status(200).send(lots)
    } catch(e) {
        console.log(e);
        res.status(500).send("internal server error")
    }
})

router.get('/lot/:id', isAuth, async (req,res) => {
    try{
        const lot = await Lot.findOne({
            where: {
                id: req.params.id
            },
            include: {model: Offre, include: [Lot, {model: User, include: Inscription}], required: true},
        })

        res.status(200).send(lot)
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
            order: [...orders, ["createdAt", "DESC"]],
            where: {
                ...filters,
                "$offre.userId$": req.user.id,
                '$offre.state$': {[Op.or]: ["Approuvé", "Terminé"]}
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
                "$offre.evaluateurId$": req.user.id,  
                "$offre.state$": "Approuvé"
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

module.exports = router
