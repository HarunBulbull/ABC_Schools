const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const fs = require('fs');
const path = require("path");
dotenv.config();

const jspath = path.join(__dirname, '..', '..', '/currentToken.json');

router.get("/student/:id", async (req, res) => {
    const url = process.env.K12_BASE_URL;
    const id = req.params.id;
    fs.readFile(jspath, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let token = JSON.parse(data).token;
        const response = await fetch(`${url}/INTCore.Web/api/partner/sso/students/${id}`, {
            method: "GET",
            headers: {'Authorization': `Bearer ${token}`},
        });
        const getRes = await response.json();
        console.log(getRes)
        if(response.ok){
            res.status(200).json(getRes)
        }
        else{
            res.status(400).json({error: "There is an error: " + getRes.ErrorMessage})
        }
    });
});

router.get("/student/:id/enrollments", async (req, res) => {
    const url = process.env.K12_BASE_URL;
    const id = req.params.id;
    fs.readFile(jspath, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let token = JSON.parse(data).token;
        const response = await fetch(`${url}/INTCore.Web/api/partner/sso/students/${id}/enrollments`, {
            method: "GET",
            headers: {'Authorization': `Bearer ${token}`},
        });
        const getRes = await response.json();
        console.log(getRes)
        if(response.ok){
            res.status(200).json(getRes)
        }
        else{
            res.status(400).json({error: "There is an error: " + getRes.ErrorMessage})
        }
    });
});

router.get("/student/:id/enrollments", async (req, res) => {
    const url = process.env.K12_BASE_URL;
    const id = req.params.id;
    fs.readFile(jspath, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let token = JSON.parse(data).token;
        const response = await fetch(`${url}/INTCore.Web/api/partner/sso/students/${id}/enrollments`, {
            method: "GET",
            headers: {'Authorization': `Bearer ${token}`},
        });
        const getRes = await response.json();
        console.log(getRes)
        if(response.ok){
            res.status(200).json(getRes)
        }
        else{
            res.status(400).json({error: "There is an error: " + getRes.ErrorMessage})
        }
    });
});

module.exports = router;