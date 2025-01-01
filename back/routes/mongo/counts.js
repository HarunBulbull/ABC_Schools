const express = require("express");
const router = express.Router();
const count = require("../../models/Counts.js")

router.get("/", async (req, res) => {
    try {
        const counts = await count.find();
        res.status(200).json(counts);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error." });
    }
});

router.post("/sinif", async (req, res) => {
    try {
        const { gradeLevel, homeRoom } = req.body;
        let sinif = "";
        if(
            gradeLevel != "KG" ||
            gradeLevel != "Kg" ||
            gradeLevel != "kG" ||
            gradeLevel != "kg"
        ){
            if(Number(gradeLevel) < 9){sinif = Number(gradeLevel) + '. Sınıf';}
            else{
                if(homeRoom.toLowerCase().includes("fen")){sinif = Number(gradeLevel) + '. Sınıf Fen';}
                else{sinif = Number(gradeLevel) + '. Sınıf Anadolu';}
            }
        }else{
            if(homeRoom.includes("3")){sinif = "3 Yaş";}
            else if(homeRoom.includes("4")){sinif = "4 Yaş";}
            else {sinif = "5 Yaş";}
        }
        const counts = await count.findOne({sinif});
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
