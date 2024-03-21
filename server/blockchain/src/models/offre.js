const { DataTypes } = require("sequelize");

const sequelize = require('../db/db_connection');
const User = require("./user");

const Offre  = sequelize.define('offres', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dDay: {
        type: DataTypes.DATE,
        allowNull: false
    },
    cahierDesCharges: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.ENUM("En attente", "Approuvé", "Non Approuvé", "Annulé", "Terminé"),
        defaultValue: "En attente",
        allowNull: false
    },
    ville: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

User.hasMany(Offre)
Offre.belongsTo(User)

User.hasMany(Offre)
Offre.belongsTo(User, {
    as: "evaluateur",
    foreignKey: {
        name: "evaluateurId",
        allowNull: false
    }
})

module.exports = Offre
