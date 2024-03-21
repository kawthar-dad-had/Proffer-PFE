const express = require("express")
const cors = require("cors");
const app = express();
var cookieParser = require("cookie-parser");
const db = require("./db/db_connection")
const path = require("path")

const inscriptionRouter = require("./routers/inscrip")
const userRouter = require("./routers/user")
const notificationRouter = require("./routers/notification")
const contact = require("./routers/mail")

app.use(cookieParser())
app.use(cors({ credentials: true, origin: true }));
app.use(express.json())

db.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

app.use('/auth/users', userRouter)
app.use('/auth/inscriptions', inscriptionRouter)
app.use('/auth/notifications', notificationRouter)
app.use('/auth/contact', contact)

app.use('/auth/uploads', express.static(path.join(__dirname, '../uploads')));

db.sync().then(() => {
  console.log('tables created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})