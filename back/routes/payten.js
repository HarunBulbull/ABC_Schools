const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const dotenv = require("dotenv");
dotenv.config();

function sha1Base64(data) {
    const hash = crypto.createHash('sha1');
    hash.update(data, 'binary');
    return hash.digest('base64');
}

router.get("/", async (req, res) => {
    const formData = new URLSearchParams();
    formData.append('clientid', '100200127');
    formData.append('amount', 95.93);
    formData.append('okUrl', 'https://abckoleji.obiziz.website/success');
    formData.append('failUrl', 'https://abckoleji.obiziz.website/fail');
    formData.append('TranType', 'Auth');
    formData.append('callbackUrl', 'https://abckoleji.obiziz.website');
    formData.append('currency', '949');
    formData.append('storeType', '3d_pay');
    formData.append('rnd', '87954458746');
    formData.append('lang', 'tr');
    formData.append('BillToName', 'name');
    formData.append('BillTocompany', 'billToCompany');
    formData.append('refreshTime', 5);
    formData.append('storeKey', 'TEST1234');

    formData.append('hash', sha1Base64('95.93|billToCompany|name|https://abckoleji.obiziz.website|100200127|949|https://abckoleji.obiziz.website/fail|ver3|tr|https://abckoleji.obiziz.website/success|5|87954458746|3D_PAY|Auth|TEST1234'));


    const string = '496harunobiziz2410.53apitestpoCqMathhevCYY1LVNbWCQWbC5I='
    console.log(sha1Base64(string));

    try {
        const response = await fetch('https://istest.asseco-see.com.tr/fim/est3Dgate', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: formData
        });
        console.log(response.status)
    } catch (err) { console.log(err); }
});


module.exports = router;