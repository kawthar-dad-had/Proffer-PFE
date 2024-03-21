const express = require("express")
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const soumission = require("./routers/soumission")
const offre = require("./routers/offre")
const favoris = require("./routers/favoris")
const db = require("./db/db_connection")
const path = require("path")

app.use(cookieParser())
app.use(cors({ credentials: true, origin: true }));
app.use(express.json())

db.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

app.use('/soumission/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/soumission", soumission)
app.use("/soumission/offres", offre)
app.use("/soumission/favoris", favoris)

db.sync().then(() => {
  console.log('tables created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})  