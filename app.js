const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const initDB = require('./config/db')

require('dotenv').config({path: './.env'});

var cors = require('cors');
const app = express();

app.use(express.json())

//cors permiso
app.use(cors());

//Parse informacion entrando
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.resolve('uploads')));

//Rutas
app.use("/api", require("./routes"));

initDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server escuchando en puerto ${PORT}`);
})
