const { DataTypes } = require("sequelize");
const Offre = require('./offre')

const sequelize = require('../db/db_connection')

const Lot  = sequelize.define('lots', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    domaine: {
        type: DataTypes.STRING,
        allowNull: false
    },
    materiels: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    employes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    budget: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    delai: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    garantie: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qualTech: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
})

Offre.hasMany(Lot);
Lot.belongsTo(Offre);
/*
sequelize.sync().then(() => {
    console.log('lots table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
*/

module.exports = Lot
