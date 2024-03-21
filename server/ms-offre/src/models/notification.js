const { DataTypes } = require("sequelize");

const sequelize = require('../db/db_connection')

const Notification = sequelize.define('notifications', {
    type: {
        type: DataTypes.ENUM("offre approuvée", "offre refusée", "lot evalué", "rdv créé", "rdv modifié", "rdv annulé", "resultat", "lot annulé"),
        allowNull: false,
    },
    titre: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    contenu: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    seen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
})

module.exports = Notification