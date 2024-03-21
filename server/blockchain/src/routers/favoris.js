const Router = require("express")
const Favoris = require("../models/favoris")
const Lot = require("../models/lot")

const router = Router()
//const { isAuth, checkPermission } = require("../utils/index")
const User = require("../models/user")
const { Op } = require("sequelize")
const Offre = require("../models/offre")
const {isAuth} = require("../middleware/auth")
const Inscription = require("../models/inscription")
const InscripMinEtab = require('../models/inscripMinEtab')

router.post('/', isAuth, /*checkPermission('client'),*/ async (req, res) => {
    try{
        const { offreId } = req.body
        await Favoris.create({
            userId: req.user.id,
            offreId
        }).then(() => {
            res.status(200).send("added to Favoris");
        }).catch(err => {
            console.log(err);
            res.status(400).send(err);
        })
    } catch(err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})

router.get('/', isAuth, /*checkPermission('client'),*/ async (req, res) => {
    try {
        const start = Number(req.query._start) || null
        const end = Number(req.query._end) || null
        const nom_like = req.query.nom_like || ''
        const ville_like = req.query.ville_like || ''
        const domaine = req.query.domaine || ''
        const filters = []

        if(nom_like != '') filters['name'] = { [Op.substring]: nom_like }
        if(ville_like != '') filters['ville'] = { [Op.substring]: ville_like }
        if(domaine.length > 0) filters['$lot.domaine$'] = { [Op.in]: typeof(domaine) == 'string' ? [domaine] : domaine }

        const favoris = await Offre.findAndCountAll({ 
            limit: parseInt(end - start),
            offset: parseInt(((end/(end-start))-1 )*(end-start)),
            where: {
                ...filters,
                dDay: {[Op.gt]: new Date()},
                state: "Approuvé"
            },
            include: [
                {model: User, include: [Inscription, InscripMinEtab]},
                {model: User, as: 'userFav', through: {model: Favoris, where: {userId: req.user.id}}, attributes: [], required: true}
            ]
        })
        console.log(favoris);
        res.header("x-total-count", favoris.count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        return res.status(200).send(favoris.rows)
    } catch(err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})

router.delete("/:offreId", isAuth, /*checkPermission('client'),*/ async (req, res) => {
    try {
        const offreId = req.params.offreId
        await Favoris.destroy({ where: { userId: req.user.id, offreId} }
        ).then(() => {
            res.status(200).send("Lot removed from Favoris")
        }).catch(e => {
            res.status(400).send(e);
        })
    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
});

module.exports = router