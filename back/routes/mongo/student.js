const express = require("express");
const router = express.Router();
const student = require("../../models/Students.js")

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const st = await student.findOne({id: id});
        if(st){
            const updatedStudent = await student.findOneAndUpdate({id: id}, updates);
            res.status(200).json(updatedStudent);
        }
        else{
            res.status(404).json({ error: "Student not found." });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error." });
    }
})

module.exports = router;
