const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

let transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'proffer902@gmail.com',
      pass: 'vuehluvbiezwfcpm'
    }
}));

module.exports = transporter;
  