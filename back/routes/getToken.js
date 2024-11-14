const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();


router.get("/:code", async (req, res) => {

    // Get environments
    const code = req.params.code;
    const url = process.env.K12_BASE_URL;
    const redirect = process.env.K12_REDIRECT_URL;
    const clientId = process.env.K12_CLIENT_ID;
    const clientSecret = process.env.K12_CLIENT_SECRET;

    // Create a formdata with environments to post
    const formData = new URLSearchParams();
    formData.append('grant_type', "authorization_code");
    formData.append('code', code);
    formData.append('redirect_uri', redirect);
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);

    // Get access token
    const response = await fetch(`${url}/GWCore.Web/connect/token`, {
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: formData.toString()
    });

    // Get response json
    const getTokenRes = await response.json();

    // Response status = 200 (get token successful):
    if(response.ok){

        // Get user info with access token
        const userInfo = await fetch(`${url}/GWCore.Web/connect/userinfo`, {
            method: "POST",
            headers: {'Authorization': `Bearer ${getTokenRes.access_token}`},
        });

        // Get response json
        const userInfoRes = await userInfo.json();

        // Response status = 200 (get user info successful)
        if(userInfo.ok){
            // Send user info to client
            res.status(200).json(userInfoRes);
        }

        // Response status != 200 (get user info error)
        else{
            // Send error message to client
            res.status(400).json({error: "There is an error on getting user info: " + userInfoRes.error})
        } 
    }

    // Response status != 200 (get token error)
    else{
        // Send error message to client
        res.status(400).json({error: "There is an error on getting token: " + getTokenRes.error})
    }
});

module.exports = router;