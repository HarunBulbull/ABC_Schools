const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const dotenv = require("dotenv");
dotenv.config();

// ! SHA1 Hash Fonksiyonu
function sha1(data) {
    const hash = crypto.createHash('sha1');
    hash.update(data, 'binary');
    return hash.digest('base64');
}

// ? Environmentals
const mbrId = process.env.QNB_MBR_ID;
const merchantId = process.env.QNB_MERCHANT_ID;
const userCode = process.env.QNB_USER_CODE;
const userPass = process.env.QNB_USER_PASS;
const threeDPass = process.env.QNB_3D_PASS;
const baseUrl = process.env.QNB_BASE_URL;
const success = process.env.SUCCESS_URL;
const fail = process.env.FAIL_URL;

// ? Main
router.post("/", async (req, res) => {
    // ! Random sayı oluşturma
    const date = new Date();
    const rnd = Number(date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + date.getMilliseconds())
    
    // ! Random order id oluşturma
    const orderId = crypto.randomBytes(12).toString('hex');
    
    // ! Ücreti bankanın istediği formata dönüştürme
    const amount = req.body.amount + ".00";

    const installment = 0;
    const hash = sha1(mbrId+orderId+amount+success+fail+'Auth'+installment+rnd+threeDPass);
    
    // ! Post edilecek form data
    const formData = new URLSearchParams();
    formData.append('MbrId', mbrId);
    formData.append('MerchantId', merchantId);
    formData.append('UserCode', userCode);
    formData.append('UserPass', userPass);
    formData.append('PurchAmount', amount);
    formData.append('Currency', '949');
    formData.append('OrderId', orderId);
    formData.append('InstallmentCount', installment);
    formData.append('TxnType', 'Auth');
    formData.append('SecureType', '3DPay');
    formData.append('CardHolderName', req.body.cardHolder);
    formData.append('Pan', req.body.cardNumber);
    formData.append('Expiry', req.body.cardExMonth + req.body.cardExYear);
    formData.append('Cvv2', req.body.cardCvv);
    formData.append('Lang', 'TR');
    formData.append('OkUrl', success);
    formData.append('FailUrl', fail);
    formData.append('Hash', hash);
    formData.append('Rnd', rnd);
    try {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        const html = await response.text();
        if(html.includes('PaReq')){res.status(200).json({ success: true, html: html });}
        else{
            const error = html.split('name=\"ErrMsg\" id=\"ErrMsg\" value=\"')[1].split('\"')[0];
            res.status(400).json({ success: false, err: error });
            console.log(error)
        }
    } catch (err) { 
        console.log(err); 
        res.status(500).json({ success: false, err: err });
    }
});


module.exports = router;