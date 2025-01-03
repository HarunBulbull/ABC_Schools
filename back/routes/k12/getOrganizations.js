const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const fs = require('fs');
const path = require("path");
dotenv.config();
const students = require("../../models/Students.js")
const current = require("../../models/Current.js");
const url = process.env.K12_BASE_URL;

async function getData() {
    try {
        const data = await current.findOne({ _id: "676beebd52f81fbc6785615b" });
        return data;
    }
    catch (error) { console.log("There is an error on getting token: " + error) }
}

router.get("/asd", async (req, res) => {
    try {
        const data = await getData();
        let total = 101;
        let index = 0;
        const alldata = [];
        while ((index * 100) < total) {
            const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${data.id}/students`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${data.token}`,
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
        const flatData = alldata.flat();

        // Tekrarlanan TC'leri bul
        const duplicateNationalIDs = flatData
            .map(item => item.nationalID)
            .filter((nationalID, index, array) => 
                array.indexOf(nationalID) !== index
            );

        // Tekrarlanan TC'leri tekil hale getir
        const uniqueDuplicateNationalIDs = [...new Set(duplicateNationalIDs)];

        res.status(200).json(uniqueDuplicateNationalIDs);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error." });
    }
});

/*router.get("/asd", async (req, res) => {
    try {
        const data = await getData();
        let total = 101;
        let index = 0;
        const alldata = [];
        while ((index * 100) < total) {
            const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${data.id}/students`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${data.token}`,
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
        const flatData = alldata.flat();
        const mongoStudents = await students.find().lean();
        let sayilar = {
            "3yas": 0,
            "4yas": 0,
            "5yas": 0,
            "1.sinif": 0,
            "2.sinif": 0,
            "3.sinif": 0,
            "4.sinif": 0,
            "5.sinif": 0,
            "6.sinif": 0,
            "7.sinif": 0,
            "8.sinif": 0,
            "9.sinif al": 0,
            "10.sinif al": 0,
            "11.sinif al": 0,
            "12.sinif al": 0,
            "9.sinif fl": 0,
            "10.sinif fl": 0,
            "11.sinif fl": 0,
            "12.sinif fl": 0,
            "gecersiz": 0,
        }

        const allStudents = flatData.filter(k12Student => mongoStudents.some(mongoStudent => mongoStudent.id === k12Student.id));

        allStudents.map(student => {
            if (student.enrollment.homeroom == null) {
                sayilar.gecersiz++;
                console.log(student.nationalID + " " + student.enrollment.gradeLevel + " " + student.enrollment.homeroom);
            } else {
                let sinif = "";
                if (
                    student.enrollment.gradeLevel != "KG" ||
                    student.enrollment.gradeLevel != "Kg" ||
                    student.enrollment.gradeLevel != "kG" ||
                    student.enrollment.gradeLevel != "kg"
                ) {
                    if (Number(student.enrollment.gradeLevel) < 9) { sinif = Number(student.enrollment.gradeLevel) + '.sinif'; }
                    else {
                        if (student.enrollment.homeroom.toLowerCase().includes("fen")) { sinif = Number(student.enrollment.gradeLevel) + '.sinif fl'; }
                        else if (student.enrollment.homeroom.toLowerCase().includes("fl")) { sinif = Number(student.enrollment.gradeLevel) + '.sinif fl'; }
                        else { sinif = Number(student.enrollment.gradeLevel) + '.sinif al'; }
                    }
                } else {
                    if (student.enrollment.homeroom.includes("3")) { sinif = "3yas"; }
                    else if (student.enrollment.homeroom.includes("4")) { sinif = "4yas"; }
                    else { sinif = "5yas"; }
                }

                sayilar[`${sinif}`]++;
            }
        })

        res.status(200).json(sayilar);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error." });
    }
});*/

/*router.get("/asd", async (req, res) => {

    fs.readFile('./eski.json', 'utf8', async (err, d) => {
        if (err) {
            console.error(err);
            return;
        }
        let eski = JSON.parse(d);

        const flat = eski.map(item => {
            const dcs = [];
            if (item.dc.length > 0) {
                item.dc.split("+").map(dc => {
                    const dcitem = dc.replaceAll(' ', '').includes('%') ? dc.replaceAll(' ', '').split('%')[1] : dc.replaceAll(' ', '');
                    let name = dcitem.substring(dcitem.length - 3, dcitem.length);
                    const value = dcitem.substring(0, dcitem.length - 3);
                    if (name === "PER") { name = "PERSONEL"; }
                    else if (name === "ÖĞR") { name = "ÖĞRETMEN"; }
                    else if (name === "KRD") { name = "KARDEŞ"; }
                    else if (name === "KEN") { name = "KENDİ ÖĞRENCİMİZ"; }
                    else if (name === "BUR") { name = "BURS"; }
                    else if (name === "ŞEH") { name = "ŞEHİT"; }
                    else if (name === "GZİ") { name = "GAZİ"; }
                    else if (name === "PEŞ") { name = "PEŞİN"; }
                    else if (name === "TEK") { name = "TEK ÇEKİM"; }
                    else if (name === "ERK") { name = "ERKEN"; }
                    else if (name === "YÖN") { name = "YÖNETİM"; }
                    else if (name === "GEÇ") { name = "GEÇİŞ"; }
                    dcs.push({ name, value: Number(value) });
                })
            }
            item.dc = dcs;
            return item;
        });

        const mongoData = await students.find().lean();

        const mergedData = flat.map(flatItem => {
            const matchingK12Data = mongoData.find(k12Item =>
                k12Item.tc === flatItem.tc
            );

            return {
                tc: matchingK12Data.tc,
                discounts: matchingK12Data.discounts,
                old: matchingK12Data.old,
                new: matchingK12Data.new,
                scholarship: matchingK12Data.scholarship,
                name: matchingK12Data.name,
                class: matchingK12Data.class,
                no: matchingK12Data.no,
                paid: 0,
                health: matchingK12Data.health,
                id: matchingK12Data.id,
                olddiscounts: flatItem.dc
            };
        });
        res.json(mergedData);
    });
});*/

router.get("/missDatas", async (req, res) => {
    try {
        const mongoStudents = await students.find({ id: { $ne: null } }).lean();
        const mongoStudentsNoId = await students.find({ id: null }).lean();
        const data = await getData();
        let total = 101;
        let index = 0;
        const alldata = [];

        while ((index * 100) < total) {
            const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${data.id}/students`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${data.token}`,
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
        const flatData = alldata.flat();

        const nok12 = [];
        const ok12 = [];

        await Promise.all(mongoStudentsNoId.map(async student => {
            const ind = flatData.findIndex(k12Item => k12Item.nationalID === student.tc);
            if (ind === -1) {
                nok12.push(student);
            } else {
                const update = await students.findByIdAndUpdate(student._id, { id: flatData[ind].id }, { new: true, lean: true });
                ok12.push(update);
            }
        }));

        const noData = [];
        flatData.map(flatItem => {
            const ind = mongoStudents.findIndex(k12Item => k12Item.id === flatItem.id);
            if (ind === -1) {
                if (ok12.length > 0) {
                    const ind2 = ok12.findIndex(k12Item => k12Item.id === flatItem.id);
                    if (ind2 === -1) {
                        noData.push(flatItem);
                    }
                } else {
                    noData.push(flatItem);
                }
            }
        });

        res.status(200).json({ nok12, ok12, noData });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error." });
    }
});

router.get("/", async (req, res) => {
    const data = await getData();
    try {
        const response = await fetch(`${url}/INTCore.Web/api/Partner/Organizations`, {
            method: "GET",
            headers: { 'Authorization': `Bearer ${data.token}` },
        });
        const getRes = await response.json();
        if (response.ok) {
            res.status(200).json(getRes)
            await current.findOneAndUpdate({ _id: "676beebd52f81fbc6785615b" }, { id: getRes[0].id });
            console.log("Organization id başarıyla güncellendi.");
        }
        else { res.status(400).json({ error: "There is an error: " + getRes.error }) }
    }
    catch (error) { console.log("There is an error on getting organizations: " + error) }
});

router.get("/withDebt", async (req, res) => {
    try {
        const data = await getData();
        const debtStudents = await students.find({
            $or: [
                { "total.education": { $gt: 0 } },
                { "total.food": { $gt: 0 } }
            ]
        });
        const promises = debtStudents.map(student =>
            fetch(`${url}/INTCore.Web/api/partner/sso/students/${student.id}`, {
                method: "GET",
                headers: { 'Authorization': `Bearer ${data.token}` },
            })
                .then(response => response.json())
                .then(getRes => ({ ...getRes, ...student?._doc }))
                .catch(error => {
                    console.log(`Error fetching student ${student.id}:`, error);
                    return null;
                })
        );
        const results = await Promise.all(promises);
        const allData = results.filter(result => result !== null);
        res.status(200).json(allData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error: " + error });
    }
});

router.get("/schools", async (req, res) => {
    try {
        const data = await getData();
        const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${data.id}/schools`, {
            method: "GET",
            headers: { 'Authorization': `Bearer ${data.token}` },
        });
        const getRes = await response.json();
        if (response.ok) { res.status(200).json(getRes) }
        else { res.status(400).json({ error: "There is an error: " + getRes.ErrorMessage }) }
    }
    catch (error) { console.log("There is an error on getting schools: " + error) }
});

router.get("/students/:skip/:take", async (req, res) => {
    const skip = req.params.skip;
    const take = req.params.take;
    try {
        const data = await getData();
        const total = await students.countDocuments();
        const mongoStudents = await students.find().lean()
            .sort({ name: 1 })
            .skip(skip)
            .limit(take);
        const promises = mongoStudents.map(async student => {
            try {
                const studentDataRes = await fetch(`${url}/INTCore.Web/api/partner/sso/students/${student.id}`, {
                    method: "GET",
                    headers: { 'Authorization': `Bearer ${data.token}` },
                });
                const studentData = await studentDataRes.json();

                const contactDataRes = await fetch(`${url}/INTCore.Web/api/Partner/SSO/ContactStudents/${student.id}`, {
                    method: "GET",
                    headers: { 'Authorization': `Bearer ${data.token}` },
                });
                const contactData = await contactDataRes.json();

                return {
                    studentData: { ...studentData, ...student },
                    contactData
                };
            } catch (error) {
                console.log(`Error fetching data for student ${student.id}:`, error);
                return null;
            }
        });

        const results = await Promise.all(promises);
        const filteredResults = results.filter(result => result !== null);
        return res.status(200).json({ total, students: filteredResults });
    }
    catch (error) { res.status(500).json({ error: "Server error: " + error }); }
});

router.get("/teachers/:skip/:take/:total", async (req, res) => {
    const skip = req.params.skip;
    const take = req.params.take;
    const total = req.params.total;
    try {
        const data = await getData();
        const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${data.id}/teachers`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${data.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                $skip: skip,
                $take: take,
                $includeTotalCount: total,
                $orderby: "StaffPersonal.Base.Name.FullName"
            })
        });
        const getRes = await response.json();
        if (response.ok) {
            const totalteachers = await response.headers.get('totalcount');
            const result = { totalteachers, teachers: getRes }
            res.status(200).json(result)
        }
        else { res.status(400).json({ error: "There is an error: " + getRes.ErrorMessage }) }
    }
    catch (error) { res.status(500).json({ error: "Server error: " + error }); }
});



router.get("/allstudents", async (req, res) => {
    try {
        const data = await getData();
        let total = 101;
        let index = 0;
        const alldata = [];
        while ((index * 100) < total) {
            const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${data.id}/students`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${data.token}`,
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
    }
    catch (err) { res.status(400).json({ error: "There is an error: " + err }) }
});

router.get("/allteachers", async (req, res) => {
    try {
        const data = await getData();
        let total = 101;
        let index = 0;
        const alldata = [];
        while ((index * 100) < total) {
            const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${data.id}/teachers`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${data.token}`,
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
    }
    catch (err) { res.status(400).json({ error: "There is an error: " + err }) }
});

router.get("/findteacher/:param", async (req, res) => {
    const param = req.params.param;
    try {
        const data = await getData();
        const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${data.id}/teachers`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${data.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                $includeTotalCount: true,
                $orderby: "StaffPersonal.Base.Name.FullName",
                $where: `StaffPersonal.Base.Name.FullName == "${param}"`
            })
        });
        const getRes = await response.json();
        if (response.ok) {
            const totalteachers = await response.headers.get('totalcount');
            const result = { totalteachers, teachers: getRes }
            res.status(200).json(result)
        }
        else { res.status(400).json({ error: "There is an error: " + getRes.ErrorMessage }) }
    }
    catch (error) { res.status(500).json({ error: "Server error: " + error }); }
});

router.get("/findstudent/:param/:skip/:take", async (req, res) => {
    const param = req.params.param;
    const skip = req.params.skip;
    const take = req.params.take;
    try {
        const data = await getData();
        const total = await students.countDocuments({
            $or: [
                { "name": { $regex: param, $options: "i" } },
                { "tc": { $regex: param, $options: "i" } }
            ]
        });
        const mongoStudents = await students.find({
            $or: [
                { "name": { $regex: param, $options: "i" } },
                { "tc": { $regex: param, $options: "i" } }
            ]
        }).lean().sort({ name: 1 }).skip(skip).limit(take);
        console.log(mongoStudents);
        const promises = mongoStudents.map(async student => {
            try {
                const studentDataRes = await fetch(`${url}/INTCore.Web/api/partner/sso/students/${student.id}`, {
                    method: "GET",
                    headers: { 'Authorization': `Bearer ${data.token}` },
                });
                const studentData = await studentDataRes.json();

                const contactDataRes = await fetch(`${url}/INTCore.Web/api/Partner/SSO/ContactStudents/${student.id}`, {
                    method: "GET",
                    headers: { 'Authorization': `Bearer ${data.token}` },
                });
                const contactData = await contactDataRes.json();

                return {
                    studentData: { ...studentData, ...student },
                    contactData
                };
            } catch (error) {
                console.log(`Error fetching data for student ${student.id}:`, error);
                return null;
            }
        });

        const results = await Promise.all(promises);
        const filteredResults = results.filter(result => result !== null);
        return res.status(200).json({ total: total, students: filteredResults });
    }
    catch (error) { res.status(500).json({ error: "Server error: " + error }); }
});

router.delete("/deletestudent/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const deletedProduct = await students.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ error: "Öğrenci bulunamadı." });
        }

        res.status(200).json(deletedProduct);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error." });
    }
});

router.post("/createstudent", async (req, res) => {
    try {
        const data = req.body;
        const newStudent = new students(data);
        await newStudent.save();
        res.status(200).json(newStudent);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error." });
    }
});

module.exports = router;