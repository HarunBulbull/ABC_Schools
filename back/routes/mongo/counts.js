const express = require("express");
const router = express.Router();
const count = require("../../models/Counts.js")

router.get("/", async (req, res) => {
    try {
        const counts = await count.findOne();
        res.status(200).json(counts);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error." });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        const updatedCounts = await count.findByIdAndUpdate(id, updates, { new: true });

        res.status(200).json(updatedCounts);


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error." });
    }
})

module.exports = router;
