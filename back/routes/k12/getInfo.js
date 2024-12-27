const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const fs = require('fs');
const path = require("path");
const student = require('../../models/Students.js');
const current = require('../../models/Current.js');
dotenv.config();
const url = process.env.K12_BASE_URL;

async function getToken() {
    try {
        const token = await current.findOne({ _id: "676beebd52f81fbc6785615b" });
        return token.token;
    }
    catch (error) { console.log("There is an error on getting token: " + error) }
}

router.get("/student/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const token = await getToken();
        const studentResponse = await fetch(`${url}/INTCore.Web/api/partner/sso/students/${id}`, {
            method: "GET",
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const contactResponse = await fetch(`${url}/INTCore.Web/api/Partner/SSO/ContactStudents/${id}`, {
            method: "GET",
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const studentRes = await studentResponse.json();
        const contactRes = await contactResponse.json();
        const dbStudent = await student.findOne({ id: studentRes.id });
        const studentData = { ...studentRes, ...dbStudent?._doc}

        if (studentResponse.ok) {res.status(200).json({ student: studentData, contact: contactRes })}
        else {res.status(400).json({ error: "There is an error: " + studentRes.ErrorMessage })}
    }
    catch (error) { console.log("There is an error on getting student: " + error) }
});

router.get("/teacher/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const token = await getToken();
        const response = await fetch(`${url}/INTCore.Web/api/partner/sso/teachers/${id}`, {
            method: "GET",
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const getRes = await response.json();
        if (response.ok) {res.status(200).json(getRes)}
        else {res.status(400).json({ error: "There is an error: " + getRes.ErrorMessage })}
    }
    catch (error) { console.log("There is an error on getting teacher: " + error) }
});


router.get("/student/:id/enrollments", async (req, res) => {
    const id = req.params.id;
    try{
        const token = await getToken();
        const response = await fetch(`${url}/INTCore.Web/api/partner/sso/students/${id}/enrollments`, {
            method: "GET",
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const getRes = await response.json();
        if (response.ok) {res.status(200).json(getRes)}
        else {res.status(400).json({ error: "There is an error: " + getRes.ErrorMessage })}
    }
    catch (error) { console.log("There is an error on getting enrollments: " + error) }
});

router.get("/contactStudents/:id", async (req, res) => {
    const id = req.params.id;
    try{
        const token = await getToken();
        const response = await fetch(`${url}/INTCore.Web/api/Partner/SSO/ContactStudents/${id}`, {
            method: "GET",
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const getRes = await response.json();
        if (response.ok) { res.status(200).json(getRes) }
        else { res.status(400).json({ error: "There is an error: " + getRes.ErrorMessage }) }
    }
    catch (error) { console.log("There is an error on getting contact students: " + error) }
});

module.exports = router;