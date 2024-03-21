const { DataTypes } = require("sequelize");
const User = require('./user')

const sequelize = require('../db/db_connection')
 
const Inscription = sequelize.define('inscriptions', {
    nom: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    type: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    numRegistre: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    numRegistreFile: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    classification: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    classificationFile: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    codes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    },
    codesFile: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    nif: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    nifFile: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    nis: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    nisFile: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    casnos: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    casnosFile: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    cacobatph: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    cacobatphFile: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    complet: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})

User.hasOne(Inscription);
Inscription.belongsTo(User);

module.exports = Inscription