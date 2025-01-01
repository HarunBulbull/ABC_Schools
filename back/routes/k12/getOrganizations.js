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

/*router.get("/asd", async (req, res) => {

    fs.readFile('./guncel.json', 'utf8', async (err, d) => {
        if (err) {
            console.error(err);
            return;
        }
        let flatted = JSON.parse(d);

        const flat = flatted.map(item => {
            return {
                ...item,
                health: {illnesses: [], medicines: [], report: ""}
            }
        });

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

        const mergedData = flat.map(flatItem => {
            const matchingK12Data = flatData.find(k12Item =>
                k12Item.nationalID === flatItem.tc
            );

            return {
                ...flatItem,
                id: matchingK12Data ? matchingK12Data.id : null
            };
        });

        const tcdata = mergedData.filter(item => item.id === null);
        res.json(mergedData);
    });
});*/

router.get("/missDatas", async (req, res) => {
    try {
        const mongoStudents = await students.find().lean();
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
                const ind2 = ok12.findIndex(k12Item => k12Item.id === flatItem.id);
                if (ind2 === -1) {
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
        return res.status(200).json({total, students: filteredResults});
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
        }).lean().sort({name: 1}).skip(skip).limit(take);
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
        return res.status(200).json({total: total, students: filteredResults});
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