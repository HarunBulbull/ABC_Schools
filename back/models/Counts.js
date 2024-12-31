const mongoose = require("mongoose");


const CountsSchema = mongoose.Schema({
    sinif: { type: String, required: true },
    meb: { type: Object, required: true },
    indirimler: { type: Array, required: true },
})


const Counts = mongoose.model("Counts", CountsSchema);
module.exports = Counts;