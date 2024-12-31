const axios = require('axios');
const crypto = require('crypto');
const express = require("express");
const router = express.Router();

function generateHash(str) {
    // UTF-8 encoding ile string'i byte array'e çevir
    // SHA512 hash hesapla ve base64'e çevir
    const hash = crypto.createHash('sha512')
        .update(Buffer.from(str, 'utf8'))
        .digest('base64');
    return hash;
}

router.get("/", async (req, res) => {
    const testString = "91.96|billToCompany|name|https://abckoleji.obiziz.website/GenericVer3ResponseHandler.php|191407264|949|https://abckoleji.obiziz.website/GenericVer3ResponseHandler.php|ver3||tr|https://abckoleji.obiziz.website/GenericVer3ResponseHandler.php|5|1234|3D_PAY_HOSTING|Auth|Test1234";
    
    const hashResult = generateHash(testString);
    console.log('Hash:', hashResult);
    res.json({ hash: hashResult });
});

module.exports = router;