const { DataTypes } = require("sequelize");

const sequelize = require('../db/db_connection');
const User = require("./user");
const Offre = require("./offre");

const Rdv = sequelize.define('rdvs', {
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hour: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    adresse: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.ENUM("Validé", "Annulé"),
        allowNull: false,
        defaultValue: "Validé"
    }
})

Offre.hasOne(Rdv);
Rdv.belongsTo(Offre);
User.hasMany(Rdv)
Rdv.belongsTo(User);

module.exports = Rdv