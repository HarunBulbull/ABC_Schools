const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

router.get("/:code", async (req, res) => {

    const code = req.params.code;
    const url = process.env.K12_BASE_URL;
    const redirect = process.env.K12_REDIRECT_URL;
    const clientId = process.env.K12_CLIENT_ID;
    const clientSecret = process.env.K12_CLIENT_SECRET;

    const formData = new URLSearchParams();
    formData.append('grant_type', "authorization_code");
    formData.append('code', code);
    formData.append('redirect_uri', redirect);
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);

    const response = await fetch(`${url}/GWCore.Web/connect/token`, {
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: formData.toString()
    });

    const getTokenRes = await response.json();
    if(response.ok){
        const userInfo = await fetch(`${url}/GWCore.Web/connect/userinfo`, {
            method: "POST",
            headers: {'Authorization': `Bearer ${getTokenRes.access_token}`},
        });
        const userInfoRes = await userInfo.json();
        if(userInfo.ok){
            res.status(200).json(userInfoRes);
        }
        else{
            res.status(400).json({error: "There is an error on getting user info: " + userInfoRes.error})
        } 
    }
    else{
        res.status(400).json({error: "There is an error on getting token: " + getTokenRes.error})
    }
});

module.exports = router;