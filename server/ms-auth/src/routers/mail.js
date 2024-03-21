var Router = require("express");
const transporter = require("../utils/nodemailer");

const router = Router();

router.post("/", async (req, res) => {
      try {
        const { object, message, email } = req.body;
        const sub = await transporter.sendMail({
          from: email +'<proffer902@gmail.com>', // sender address
          to: "ayyoub.benhocine@gmail.com", // list of receivers
          subject: object, // Subject line
          text: message, // plain text body
        });
        if (sub.accepted.length > 0) {
          res.status(200).send("Email sent");
        } else {
          res.status(500).send("Error");
        }
      } catch (error) {
        console.log(error);
        res.status(500).send(error);
      }
    }
)

module.exports = router