const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const port = 5000;
const mainRoute = require('./routes/index.js')
dotenv.config();


const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected MongoDb");
    } catch (error) {
        throw error;
    }
}

app.use(logger("dev"));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));


const corsOptions = {
  origin: '*',
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/api", mainRoute);

app.listen(port, () => {
    connect();
    console.log(`Sunucu ${port} portunda çalışıyor`);
})
