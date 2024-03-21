const sequelize = require('../db/db_connection')

const User = require("./user")
const Notification = require("./notification")

const NotificationUser = sequelize.define('notification_user', {}, { timestamps: false });

User.belongsToMany(Notification, { through: NotificationUser });
Notification.belongsToMany(User, { through: NotificationUser });

module.exports = NotificationUser