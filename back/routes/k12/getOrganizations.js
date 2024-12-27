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

router.get("/students/:skip/:take/:total", async (req, res) => {
    const skip = req.params.skip;
    const take = req.params.take;
    const total = req.params.total;
    try {
        const data = await getData();
        const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${data.id}/students`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${data.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                $skip: skip,
                $take: take,
                $includeTotalCount: total,
                $orderby: "StudentPersonal.Base.Name.FullName",
            })
        });
        const getRes = await response.json();
        
        if (response.ok) {
            const studentIds = getRes.map(student => student.id);
            const matchingStudents = await students.find({
                id: { $in: studentIds }
            });

            const contactPromises = studentIds.map(id => 
                fetch(`${url}/INTCore.Web/api/Partner/SSO/ContactStudents/${id}`, {
                    method: "GET",
                    headers: { 'Authorization': `Bearer ${data.token}` },
                })
                .then(res => res.json())
                .catch(err => {
                    console.log(`Contact fetch error for student ${id}:`, err);
                    return null;
                })
            );

            const contactResults = await Promise.all(contactPromises);

            const mergedStudents = getRes.map((k12Student, index) => {
                const dbStudent = matchingStudents.find(s => s.id === k12Student.id);
                const contactData = contactResults[index];
                
                return {
                    studentData: {
                        ...k12Student,
                        ...dbStudent?._doc
                    },
                    contactData: contactData
                };
            });

            const totalstudents = await response.headers.get('totalcount');
            const result = { totalstudents, students: mergedStudents }
            res.status(200).json(result);
        }
        else { res.status(400).json({ error: "There is an error: " + getRes.ErrorMessage }) }
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

router.get("/findstudent/:param", async (req, res) => {
    const param = req.params.param;
    try {
        const data = await getData();
        const response = await fetch(`${url}/INTCore.Web/api/partner/organizations/${data.id}/students`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${data.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                $includeTotalCount: true,
                $orderby: "StudentPersonal.Base.Name.FullName",
                $where: `StudentPersonal.Base.Name.FullName == "${param}"`
            })
        });
        const getRes = await response.json();
        if (response.ok) {
            const studentIds = getRes.map(student => student.id);
            const matchingStudents = await students.find({
                id: { $in: studentIds }
            });
            const contactPromises = studentIds.map(id => 
                fetch(`${url}/INTCore.Web/api/Partner/SSO/ContactStudents/${id}`, {
                    method: "GET",
                    headers: { 'Authorization': `Bearer ${data.token}` },
                })
                .then(res => res.json())
                .catch(err => {
                    console.log(`Contact fetch error for student ${id}:`, err);
                    return null;
                })
            );

            const contactResults = await Promise.all(contactPromises);

            const mergedStudents = getRes.map((k12Student, index) => {
                const dbStudent = matchingStudents.find(s => s.id === k12Student.id);
                const contactData = contactResults[index];
                
                return {
                    studentData: {
                        ...k12Student,
                        ...dbStudent?._doc
                    },
                    contactData: contactData
                };
            });

            const totalstudents = await response.headers.get('totalcount');
            const result = { totalstudents, students: mergedStudents }
            res.status(200).json(result);
        }
        else { res.status(400).json({ error: "There is an error: " + getRes.ErrorMessage }) }
    }
    catch (error) { res.status(500).json({ error: "Server error: " + error }); }
});

module.exports = router;