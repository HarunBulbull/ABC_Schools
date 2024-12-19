const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const dotenv = require("dotenv");
const axios = require('axios');
const xml2js = require('xml2js');
dotenv.config();

// ? Environmentals
const merchantId = process.env.YKB_MERCHANT_ID;
const terminalId = process.env.YKB_TERMINAL_ID;
const posnetId = process.env.YKB_POSNET_ID;
const encKey = process.env.YKB_ENCRYPTION_KEY;

// ! SHA256 Hash Fonksiyonu
function sha256(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data, 'binary');
    return hash.digest('base64');
}

// ? 3D Secure adımı
async function Payment(data1, data2, sign) {
    const formData = new URLSearchParams();
    formData.append('mid', merchantId);
    formData.append('posnetID', posnetId);
    formData.append('posnetData', data1);
    formData.append('posnetData2', data2);
    formData.append('digest', sign);
    formData.append('vftCode', '');
    formData.append('merchantReturnURL', 'https://abckoleji.obiziz.website');
    formData.append('lang', 'tr');
    formData.append('openANewWindow', 0);
    try {
        const response = await fetch(`https://setmpos.ykb.com/3DSWebService/YKBPaymentService`, {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        const html = await response.text();
        return html;
    } catch (err) { console.log(err); }
}

// ? Main
router.get("/", async (req, res) => {
    const orderId = crypto.randomBytes(10).toString('hex');
    const amount = 1000;
    const currency = 'TL';
    const xmlData = `
    <posnetRequest>
        <mid>${merchantId}</mid>
        <tid>${terminalId}</tid>
        <oosRequestData>
            <posnetid>${posnetId}</posnetid>
            <XID>${orderId}</XID>
            <amount>${amount}</amount>
            <currencyCode>${currency}</currencyCode>
            <installment>00</installment>
            <tranType>Sale</tranType>
            <cardHolderName>Test user</cardHolderName>
            <ccno>5400637500005263</ccno>
            <expDate>2909</expDate>
            <cvc>111</cvc> 
        </oosRequestData>
    </posnetRequest>
    `;
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Charset': 'utf-8',
            'X-MERCHANT-ID': merchantId,
            'X-TERMINAL-ID': terminalId,
            'X-POSNET-ID': posnetId,
            'X-CORRELATION-ID': orderId
        }
    };
    axios.post('https://setmpos.ykb.com/PosnetWebService/XML', `xmldata=${encodeURIComponent(xmlData)}`, config)
        .then(response => xml2js.parseStringPromise(response.data))

        // ? XMLden dönüştürülmüş veriyi işleme
        .then(parsedData => {
            const result = Number(parsedData['posnetResponse']['approved'][0]) // ! İşlem sonucu 1 ya da 0
            if (result == 1) {
                const data1 = parsedData['posnetResponse']['oosRequestDataResponse'][0]['data1'][0];
                const data2 = parsedData['posnetResponse']['oosRequestDataResponse'][0]['data2'][0];
                const sign = parsedData['posnetResponse']['oosRequestDataResponse'][0]['sign'][0];

                // ? Hashlenmiş veriler ile 3D secure adımı
                return Payment(data1, data2, sign);
            }
            else {
                const errCode = parsedData['posnetResponse']['respCode'][0];
                const err = parsedData['posnetResponse']['respText'][0];
                return res.status(400).json({ success: false, errCode, err });
            }
        })

        // ? 3D sonucunu kontrol etme
        .then(threeDResult => {
            if (threeDResult.includes('<!DOCTYPE html>')) { res.status(400).json({ success: false, errCode: '-1ABC', err: "3D Hatası", threeDResult }); }
            else {
                const firstHash = sha256(encKey + ";" + terminalId);
                const secondHash = sha256(orderId + ";" + amount + ";" + currency + ";" + merchantId + ";" + firstHash);
                const bankPacket = threeDResult.split('<input type="hidden" name="BankPacket" value="')[1].split('">')[0]
                const merchantPacket = threeDResult.split('<input type="hidden" name="MerchantPacket" value="')[1].split('">')[0];
                const sign = threeDResult.split('<input type="hidden" name="Sign" value="')[1].split('">')[0];
                const xmlData = `
                    <posnetRequest>
                        <mid>${merchantId}</mid>
                        <tid>${terminalId}</tid>
                        <oosResolveMerchantData>
                            <bankData>${bankPacket}</bankData>
                            <merchantData>${merchantPacket}</merchantData>
                            <sign>${sign}</sign>
                            <mac>${secondHash}</mac>
                        </oosResolveMerchantData>
                    </posnetRequest>
                    `;
                
                // ? Verilerin doğruluğunu karşılaştırması için kendi hashlerimizi ve bankadan dönenleri gönderiyoruz
                axios.post('https://setmpos.ykb.com/PosnetWebService/XML', `xmldata=${encodeURIComponent(xmlData)}`, config)
                    .then(response => xml2js.parseStringPromise(response.data))

                    // ? XMLden dönüştürülmüş veriyi işleme
                    .then(parsedData => {
                        const approved = Number(parsedData['posnetResponse']['approved'][0]); // ! İşlem sonucu 1 ya da 0
                        if(approved == 1){return res.status(200).json({ success: true });}
                        else{
                            const errCode = parsedData['posnetResponse']['respCode'][0];
                            const err = parsedData['posnetResponse']['respText'][0];
                            return res.status(400).json({ success: false, errCode, err });
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        return res.status(400).json({ success: false, errCode: "-1ABC", err: error });
                    });
            }
        })
        .catch(error => {
            console.error(error);
            return res.status(400).json({ success: false, errCode: "-1ABC", err: error });
        });
});


module.exports = router;