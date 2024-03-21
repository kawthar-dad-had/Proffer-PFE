const { DataTypes } = require("sequelize");
const User = require('./user')

const sequelize = require('../db/db_connection')
 
const InscripMinEtab = sequelize.define('inscriptions_ministeres_etabs', {
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nif: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nis: {
        type: DataTypes.STRING,
        allowNull: false
    },
    codeOrdonnateur:{
        type: DataTypes.STRING,
        allowNull: false
    },
    nifFile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nisFile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    codeOrdonnateurFile: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

User.hasOne(InscripMinEtab)
InscripMinEtab.belongsTo(User)

User.hasMany(InscripMinEtab)
InscripMinEtab.belongsTo(User, {
    as: 'ministere',
    foreignKey: {
        name: 'ministereId',
        allowNull: true
    }
})

module.exports = InscripMinEtab