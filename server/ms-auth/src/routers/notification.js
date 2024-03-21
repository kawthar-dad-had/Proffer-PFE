const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const Notification = require('../models/notification')
const { isAuth } = require("../middleware/auth");
const NotificationUser = require('../models/notificationUser')
const moment = require("moment")
const _ = require('lodash');


router.get('/', isAuth, async (req, res) => {
    try {
        let notifications = await Notification.findAll({
            include: {model: User, where: {id: req.user.id}, required: true},
        });

	notifications = notifications.map(notification => {
          let contenu = notification.contenu;
    
          switch (notification.type) {
            case 'offre approuvée':
              contenu = 'Votre Offre ' + notification.contenu + ' a été approuvée par l\'administrateur';
              break;
            case 'offre refusée':
              contenu = 'Votre Offre ' + notification.contenu + ' a été refusée par l\'administrateur';
              break;
            case 'lot evalué':
              contenu = 'Votre Offre ' + notification.contenu + ' a été évalué par l\'évaluateur';
              break;
            case 'rdv créé':
              contenu = 'Un rendez-vous a été créé pour ' + notification.contenu;
              break;
            case 'rdv modifié':
              contenu = 'Le rendez-vous pour a été modifié ' + notification.contenu;
              break;
            case 'rdv annulé':
              contenu = 'Le rendez-vous  a été annulé pour ' + notification.contenu;
              break;
            case 'resultat':
              contenu = 'Le résultat pour ' + notification.contenu + ' est disponible';
              break;
            default:
              break;
          }
    
          return {
            ...notification.toJSON(),
            contenu,
          };
        });

        const groupedNotifications = _.groupBy(notifications, notification => {
            const createdAt = moment(notification.createdAt);
            const today = moment().startOf('day');
            const yesterday = moment().subtract(1, 'day').startOf('day');
          
            if (createdAt.isSame(today, 'd')) {
              return 'Today';
            } else if (createdAt.isSame(yesterday, 'd')) {
              return 'Yesterday';
            } else {
              return 'Others';
            }
        });

        const unseenNotifications = notifications.filter(notification => !notification.seen).length;

        const response = {
      groupedNotifications,
      unseenNotifications
    };

    res.status(200).json(response);
    } catch (error) {
      console.log(error);
        res.status(500).send("Internal Server Error")
    }
})

 router.patch('/', isAuth, async (req, res) => {
    try {
        const list = await NotificationUser.findAll({where: {userId: req.user.id}})

        for (let l of list) {
          await Notification.update({seen: true}, {where: {id: l.notificationId}})
        }
        
        res.status(200).send('notifications seen')
    } catch (error) {
      console.log(error);
        res.status(500).send("Internal Server Error")
    }
 })

module.exports = router