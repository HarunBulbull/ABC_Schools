const mongoose = require("mongoose");


const CurrentsSchema = mongoose.Schema({
    id: { type: String, required: true },
    token: { type: String, required: true }
})


const Currents = mongoose.model("Currents", CurrentsSchema);
module.exports = Currents;