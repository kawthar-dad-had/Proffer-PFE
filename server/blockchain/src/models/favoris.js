const sequelize = require('../db/db_connection')

const User = require("./user")
const Offre = require("./offre")

const Favoris = sequelize.define('favorites', {}, { timestamps: false });

User.belongsToMany(Offre, { through: Favoris });
Offre.belongsToMany(User, { as: 'userFav', through: Favoris });

module.exports = Favoris