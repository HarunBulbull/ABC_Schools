const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const dotenv = require("dotenv");
dotenv.config();

const merchantId = process.env.KUVEYT_MERCHANT_ID;
const customerId = process.env.KUVEYT_CUSTOMER_ID;
const username = process.env.KUVEYT_USERNAME;
const password = process.env.KUVEYT_PASSWORD;
const base = process.env.KUVEYT_BASE_URL;
const success = process.env.SUCCESS_URL;
const fail = process.env.FAIL_URL;

function sha1Base64(data) {
    const hash = crypto.createHash('sha1');
    hash.update(data, 'binary');
    return hash.digest('base64');
}

router.post("/", async (req, res) => {
    const orderId = crypto.randomBytes(12).toString('hex');
    const amount = req.body.amount;
    const HashedPassword = sha1Base64(password);
    const HashData = sha1Base64(merchantId + orderId + amount + success + fail + username + HashedPassword);
    const data = {
        merchantOrderId: orderId,
        successUrl: success,
        failUrl: fail,
        merchantId: merchantId,
        customerId: customerId,
        username: username,
        password: password,
        hashData: HashData,
        amount: amount,
        currency: '0949',
        installmentCount: req.body.installment,
        customer: {email: 'noreply@kuveytturk.com.tr'},
        card: {
            cardNumber: req.body.cardNumber,
            cardHolderName: req.body.cardHolder,
            expireMonth: req.body.cardExMonth,
            expireYear: req.body.cardExYear,
            securityCode: req.body.cardCvv
        }
    };
    try {
        const response = await fetch(`${base}/KTPay/Payment`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const html = await response.text();
        if(html.includes('"Success\":false')){
            const error = html.split('ResponseMessage\":\"')[1].split('\",')[0];
            res.status(400).json({ success: false, err: error });
        }
        else{res.status(200).json({ success: true, html: html });}
    } catch (err) { 
        console.log(err); 
        res.status(500).json({ success: false, err: err });
    }
});


module.exports = router;