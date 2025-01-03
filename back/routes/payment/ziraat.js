const crypto = require('crypto');
const express = require("express");
const router = express.Router();

const baseUrl = process.env.ZIRAAT_BASE_URL;
const clientId = process.env.ZIRAAT_CLIENT_ID;
const storeKey = process.env.ZIRAAT_STORE_KEY;
const successUrl = process.env.SUCCESS_URL;
const failUrl = process.env.FAIL_URL;
const callbackUrl = process.env.CALLBACK_URL;

function sha512(data) {
    const hash = crypto.createHash('sha512');
    hash.update(data, 'binary');
    return hash.digest('base64');
}

router.get("/", async (req, res) => {
    const orderId = crypto.randomBytes(12).toString('hex');
    const date = new Date();
    const rnd = Number(date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + date.getMilliseconds())
    const amount = "10.00";
    const hashString = `${amount}|${callbackUrl}|${clientId}|949|${failUrl}|ver3|tr|${orderId}|${successUrl}|${rnd}|3d_pay_hosting|Auth|${storeKey}`;
    const hash = sha512(hashString);

    const formData = new URLSearchParams();
    formData.append('clientid', clientId);
    formData.append('storetype', "3d_pay_hosting");
    formData.append('hash', hash);
    formData.append('hashAlgorithm', "ver3");
    formData.append('TranType', "Auth");
    formData.append('amount', amount);
    formData.append('currency', "949");
    formData.append('oid', orderId);
    formData.append('okUrl', successUrl);
    formData.append('callbackUrl', callbackUrl);
    formData.append('failUrl', failUrl);
    formData.append('lang', "tr");
    formData.append('rnd', rnd);

    try {
        const response = await fetch(`${baseUrl}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        const html = await response.text();
        res.send(html);
    } catch (err) { 
        console.log(err); 
        res.status(500).json({ success: false, err: err });
    }
});

module.exports = router;