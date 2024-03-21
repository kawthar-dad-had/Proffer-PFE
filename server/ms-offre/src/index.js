const express = require('express')
const cors = require('cors')
const sequelize = require('./db/db_connection')
const offreRouter = require('./routers/offre')
const rdvRouter = require('./routers/rdv')
var cookieParser = require("cookie-parser");
const path = require('path')

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(cors({ credentials: true, origin: true }))
app.use('/offre/offres', offreRouter)
app.use('/offre/rdvs', rdvRouter)
//app.use(subscriberayyoub)

sequelize.sync().then(() => {
  console.log('tables table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

app.use('/offre/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})