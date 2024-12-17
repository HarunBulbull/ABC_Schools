const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const crypto = require('crypto');
const iconv = require('iconv-lite');
const moment = require('moment');
const { json } = require("stream/consumers");
dotenv.config();

const success = process.env.SUCCESS_URL;
const fail = process.env.FAIL_URL;

function createHtmlResponse(url) {
    var htmlResp = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting...</title>
    <script>
        // URL to redirect to
        const redirectUrl = "${url}";

        // Function to perform the redirect
        function redirect() {
            window.location.href = redirectUrl;
        }

        // Redirect as soon as the page loads
        window.onload = redirect;

        // Fallback: If window.onload doesn't trigger, redirect after a short delay
        setTimeout(redirect, 100);
    </script>
</head>
<body>
    <p>If you are not redirected automatically, please <a href="${url}">click here</a>.</p>
</body>
</html>`;
    return htmlResp;
}

function sha1(text) {
    const hash = crypto.createHash('sha1');
    hash.update(iconv.encode(text, 'latin1'));
    return hash.digest('hex').toUpperCase();
}

function sha512(text) {
    const hash = crypto.createHash('sha512');
    hash.update(iconv.encode(text, 'latin1'));
    return hash.digest('hex').toUpperCase();
}

function getHashData(provisionPassword, terminalId, orderId, installmentCount, storeKey, amount, currencyCode, successUrl, type, errorUrl) {
    const hashedPassword = sha1(provisionPassword + '0' + terminalId);
    return sha512(terminalId + orderId + amount + currencyCode + successUrl + errorUrl + type + installmentCount + storeKey + hashedPassword).toUpperCase();
}

function convertToNumeric(value) {
    const parts = value.split('.');
    let mainPart = parts[0];
    let centPart = parts[1] || '0';
    let mainNumber = parseInt(mainPart, 10);
    let centNumber = parseInt(centPart.padEnd(2, '0').slice(0, 2), 10);
    let totalCent = (mainNumber * 100) + centNumber;
    return totalCent;
}

function create3DPayForm(orderId, userEmail, userIp, cardInfo, amount, installmentCount = 0, currency) {
    const garantiApiUrl = process.env.GARANTI_ENDPOINT_PAYMENT;
    const provisionPassword = process.env.GARANTI_PROVISION_PASSWORD;
    const terminalProvUserId = process.env.GARANTI_TERMINAL_PROVUSERID;
    const terminalUserId = process.env.GARANTI_TERMINAL_USERID;
    const terminalMerchantId = process.env.GARANTI_TERMINAL_MERCHANTID;
    const terminalId = process.env.GARANTI_TERMINAL_USERID;
    const storeKey = process.env.GARANTI_STORE_KEY;
    const txnType = process.env.GARANTI_TXN_TYPE;
    const mode = process.env.GARANTI_MODE;
    const apiVersion = process.env.GARANTI_API_VERSION;
    const threeDType = process.env.GARANTI_API_3D_TYPE;
    const refreshTime = process.env.GARANTI_API_REFRESH_TIME;
    var hash = getHashData(provisionPassword, terminalId, orderId, installmentCount, storeKey, amount, currency, success, txnType, fail);
    const formData = new URLSearchParams();
    formData.append('mode', mode);
    formData.append('apiversion', apiVersion);
    formData.append('secure3dsecuritylevel', threeDType);
    formData.append('terminalprovuserid', terminalProvUserId);
    formData.append('terminaluserid', terminalUserId);
    formData.append('terminalmerchantid', terminalMerchantId);
    formData.append('terminalid', terminalId);
    formData.append('txntype', txnType);
    formData.append('txnamount', amount);
    formData.append('txncurrencycode', currency);
    formData.append('txninstallmentcount', installmentCount);
    formData.append('orderid', orderId);
    formData.append('successurl', success);
    formData.append('errorurl', fail);
    formData.append('customeremailaddress', userEmail);
    formData.append('customeripaddress', userIp);
    formData.append('secure3dhash', hash);
    formData.append('refreshtime', refreshTime);
    formData.append('txntimestamp', moment().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'));
    formData.append('cardnumber', cardInfo.number);
    formData.append('cardholdername', cardInfo.name);
    formData.append('cardexpiredatemonth', cardInfo.expiryMonth);
    formData.append('cardexpiredateyear', cardInfo.expiryYear);
    formData.append('cardcvv2', cardInfo.cvc);
    formData.append('storekey', storeKey);
    return formData;
}

router.post("/result", async (req, res) => {
    const formData = req.body;
    const responseHash = formData.hash.toUpperCase();
    const hashParams = formData.hashparams;
    const paramList = hashParams.split(':');
    const hashString = paramList
        .map(param => formData[param] || '')
        .join('') + process.env.GARANTI_STORE_KEY;
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex').toUpperCase();
    const { response } = formData;
    if (calculatedHash !== responseHash) {return res.status(200).send(createHtmlResponse(fail));}
    if (formData.procreturncode !== '00') {return res.status(200).send(createHtmlResponse(fail));}
    if (response == 'Approved') {return res.status(200).send(createHtmlResponse(success));}
    return res.status(200).send(createHtmlResponse(fail));
});

router.post("/", async (req, res) => {
    const { cardInfo, paymentInfo, user, products, userData, indirimler, kargo } = req.body;
    const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let email = user.email;
    if (email == null || email == "undefined" || email == undefined) { email = "info@obiziz.com" }
    const orderId = crypto.randomBytes(12).toString('hex');
    var formData = create3DPayForm(orderId, email, userIp, cardInfo, convertToNumeric(paymentInfo.amount), paymentInfo.installmentCount, paymentInfo.currency);
    if (formData == null) {
        res.status(200).json({ success: false });
        return;
    }
    const garantiRes = await fetch(process.env.GARANTI_ENDPOINT_PAYMENT, {
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: formData.toString()
    });
    if (!garantiRes.ok) {
        res.status(200).json({ success: false });
        return;
    }
    var htmlResponse = await garantiRes.text();
    res.status(200).json({ success: true, html: htmlResponse });
})

module.exports = router;
