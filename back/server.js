const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const port = 5000;
const mainRoute = require('./routes/index.js')
const fs = require('fs');
const http = require('http');
const current = require('./models/Current.js');

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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));


const corsOptions = {
    origin: '*',
    credentials: true,
};

const authMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ 
            success: false, 
            message: 'Geçersiz API anahtarı' 
        });
    }
    
    next();
};

async function updateToken() {
    try {
        const url = process.env.K12_BASE_URL;
        const clientId = process.env.K12_CLIENT_ID;
        const clientSecret = process.env.K12_CLIENT_SECRET;

        const formData = new URLSearchParams();
        formData.append('grant_type', "client_credentials");
        formData.append('client_id', clientId);
        formData.append('client_secret', clientSecret);

        const response = await fetch(`${url}/GWCore.Web/connect/token`, {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });

        const getTokenRes = await response.json();

        if (response.ok) {
            await current.findOneAndUpdate({ _id: "676beebd52f81fbc6785615b" }, { token: getTokenRes.access_token });
            console.log("K12 token başarıyla güncellendi. => " + new Date());
        }
        else {console.log("There is an error on getting token: " + getTokenRes.error)}
    }
    catch (error) {console.log("There is an error on updating token: " + error)}
}
updateToken();
setInterval(updateToken, 3300000);      

app.use(cors(corsOptions));
//app.use("/api", authMiddleware, mainRoute);
app.use("/api", mainRoute);

app.listen(port, () => {
    connect();
    console.log(`Sunucu ${port} portunda çalışıyor`);
})
