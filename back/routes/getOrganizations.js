const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const fs = require('fs');
const path = require("path");
dotenv.config();

const jspath = path.join(__dirname, '..', '..', '/currentToken.json');

router.get("/", async (req, res) => {
    const url = process.env.K12_BASE_URL;
    fs.readFile(jspath, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let token = JSON.parse(data).token;
        const response = await fetch(`${url}/INTCore.Web/api/Partner/Organizations`, {
            method: "GET",
            headers: {'Authorization': `Bearer ${token}`},
        });
        const getRes = await response.json();
        if(response.ok){
            res.status(200).json(getRes)
            let jsonData = {token: token, id: getRes[0].id}
            fs.writeFile(jspath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Organization id güncellendi! => ' + new Date());
                }
            });
        }
        else{
            res.status(400).json({error: "There is an error: " + getRes.error})
        }
    });
});

router.get("/schools", async (req, res) => {
    const url = process.env.K12_BASE_URL;
    fs.readFile(jspath, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let token = JSON.parse(data).token;
        let orgid = JSON.parse(data).id;
        const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${orgid}/schools`, {
            method: "GET",
            headers: {'Authorization': `Bearer ${token}`},
        });
        const getRes = await response.json();
        if(response.ok){
            res.status(200).json(getRes)
        }
        else{
            res.status(400).json({error: "There is an error: " + getRes.ErrorMessage})
        }
    });
});

router.get("/students/:skip/:take/:total", async (req, res) => {
    const skip = req.params.skip;
    const take = req.params.take;
    const total = req.params.total;
    const url = process.env.K12_BASE_URL;
    fs.readFile(jspath, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let token = JSON.parse(data).token;
        let orgid = JSON.parse(data).id;
        const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${orgid}/students`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                $skip: skip,
                $take: take,
                $includeTotalCount: total
            })
        });
        const getRes = await response.json();
        if(response.ok){
            res.status(200).json(getRes)
        }
        else{
            res.status(400).json({error: "There is an error: " + getRes.ErrorMessage})
        }
    });
});

router.get("/teachers/:skip/:take/:total", async (req, res) => {
    const skip = req.params.skip;
    const take = req.params.take;
    const total = req.params.total;
    const url = process.env.K12_BASE_URL;
    fs.readFile(jspath, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let orgid = JSON.parse(data).id;
        let token = JSON.parse(data).token;
        const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${orgid}/teachers`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                $skip: skip,
                $take: take,
                $includeTotalCount: total
            })
        });
        const getRes = await response.json();
        if(response.ok){
            res.status(200).json(getRes)
        }
        else{
            res.status(400).json({error: "There is an error: " + getRes.ErrorMessage})
        }
    });
});

module.exports = router;