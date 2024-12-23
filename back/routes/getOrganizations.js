const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const fs = require('fs');
const path = require("path");
dotenv.config();

const jspath = path.join(__dirname, '..', '..', '/currentToken.json');
const url = process.env.K12_BASE_URL;

router.get("/", async (req, res) => {
    fs.readFile(jspath, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let token = JSON.parse(data).token;
        const response = await fetch(`${url}/INTCore.Web/api/Partner/Organizations`, {
            method: "GET",
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const getRes = await response.json();
        if (response.ok) {
            res.status(200).json(getRes)
            let jsonData = { token: token, id: getRes[0].id }
            fs.writeFile(jspath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Organization id güncellendi! => ' + new Date());
                }
            });
        }
        else {
            res.status(400).json({ error: "There is an error: " + getRes.error })
        }
    });
});

router.get("/schools", async (req, res) => {
    fs.readFile(jspath, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let token = JSON.parse(data).token;
        let orgid = JSON.parse(data).id;
        const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${orgid}/schools`, {
            method: "GET",
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const getRes = await response.json();
        if (response.ok) {
            res.status(200).json(getRes)
        }
        else {
            res.status(400).json({ error: "There is an error: " + getRes.ErrorMessage })
        }
    });
});

router.get("/students/:skip/:take/:total", async (req, res) => {
    const skip = req.params.skip;
    const take = req.params.take;
    const total = req.params.total;
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
        if (response.ok) {
            const totalstudents = await response.headers.get('totalcount');
            const result = { totalstudents, students: getRes }
            res.status(200).json(result)
        }
        else {
            res.status(400).json({ error: "There is an error: " + getRes.ErrorMessage })
        }
    });
});

router.get("/teachers/:skip/:take/:total", async (req, res) => {
    const skip = req.params.skip;
    const take = req.params.take;
    const total = req.params.total;
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
        if (response.ok) {
            const totalteachers = await response.headers.get('totalcount');
            const result = { totalteachers, teachers: getRes }
            res.status(200).json(result)
        }
        else {
            res.status(400).json({ error: "There is an error: " + getRes.ErrorMessage })
        }
    });
});

router.get("/allstudents", async (req, res) => {

    try {
        fs.readFile(jspath, 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let token = JSON.parse(data).token;
            let orgid = JSON.parse(data).id;
            let total = 101;
            let index = 0;
            const alldata = [];
            while ((index * 100) < total) {
                const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${orgid}/students`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        $skip: index * 100,
                        $take: 100,
                        $includeTotalCount: true
                    })
                });
                total = await response.headers.get('totalcount');
                const getRes = await response.json();
                alldata.push(getRes);
                index++;
            }
            const result = { total, data: alldata.flat() }
            res.status(200).json(result)
            /*const flatData = alldata.flat();
            fs.readFile('./data.json', 'utf8', async (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                const all = JSON.parse(data);
                all.map(item => {
                    item.discounts = item.discounts.split('+').map(discount => {
                        if(discount.length>0){
                            const clean = String(discount.split('%')[1]);
                            const discountValue = clean.substring(0, (clean.length - 3));
                            const discountType = clean.substring((clean.length - 3), clean.length);
                            return { name: discountType, discount: discountValue }
                        }
                        return {}
                    });
                });
                const allMap = new Map(all.map(item => [item.tc, item]));

                const mergedData = flatData.map(item1 => {
                    const foundItem = allMap.get(item1.nationalID);
                    return foundItem ? { ...item1, ...foundItem } : item1;
                });
                res.status(200).json(mergedData.map(item => ({
                    id: item.id,
                    discounts: item.discounts ? item.discounts : []
                })));
            });*/
        });
    }
    catch (err) { res.status(400).json({ error: "There is an error: " + err }) }
});

router.get("/allteachers", async (req, res) => {

    try {
        fs.readFile(jspath, 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let token = JSON.parse(data).token;
            let orgid = JSON.parse(data).id;
            let total = 101;
            let index = 0;
            const alldata = [];
            while ((index * 100) < total) {
                const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${orgid}/teachers`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        $skip: index * 100,
                        $take: 100,
                        $includeTotalCount: true
                    })
                });
                total = await response.headers.get('totalcount');
                const getRes = await response.json();
                alldata.push(getRes);
                index++;
            }
            const result = { total, data: alldata.flat() }
            res.status(200).json(result)
        });
    }
    catch (err) { res.status(400).json({ error: "There is an error: " + err }) }
});

router.get("/findteacher/:param", async (req, res) => {
    const param = req.params.param;
    try {
        fs.readFile(jspath, 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let token = JSON.parse(data).token;
            let orgid = JSON.parse(data).id;
            let total = 101;
            let index = 0;
            const alldata = [];
            while ((index * 100) < total) {
                const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${orgid}/teachers`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        $skip: index * 100,
                        $take: 100,
                        $includeTotalCount: true
                    })
                });
                total = await response.headers.get('totalcount');
                const getRes = await response.json();
                alldata.push(getRes);
                index++;
            }
            const filteredData = alldata.flat().filter((el) => el.fullName.includes(param))
            res.status(200).json(filteredData)
        });
    }
    catch (err) { res.status(400).json({ error: "There is an error: " + err }) }
});

router.get("/findstudent/:param", async (req, res) => {
    const param = req.params.param;
    try {
        fs.readFile(jspath, 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let token = JSON.parse(data).token;
            let orgid = JSON.parse(data).id;
            let total = 101;
            let index = 0;
            const alldata = [];
            while ((index * 100) < total) {
                const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${orgid}/students`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        $skip: index * 100,
                        $take: 100,
                        $includeTotalCount: true
                    })
                });
                total = await response.headers.get('totalcount');
                const getRes = await response.json();
                alldata.push(getRes);
                index++;
            }
            const filteredData = alldata.flat().filter((el) => el.fullName.includes(param))
            res.status(200).json(filteredData)
        });
    }
    catch (err) { res.status(400).json({ error: "There is an error: " + err }) }
});

module.exports = router;