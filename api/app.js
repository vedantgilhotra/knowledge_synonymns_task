const express = require("express");
const app = express();
const compression = require("compression");
const logger = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require('cors')
const routes = require("./src/routes/ApiRouter");
const dotenv = require('dotenv');

dotenv.config({path: "./config.env"});

app.use(logger("dev"));

app.use(compression()); 

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use("/",routes);

app.set("port",process.env.PORT || 8000);

app.listen(app.get("port"),() =>{
    console.log("Application running on port ",app.get("port"));
});


module.exports = app;