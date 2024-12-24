const mongoose = require("mongoose");


const StudentsSchema = mongoose.Schema({
    id: { type: String, required: true },
    discounts: { type: Array, default: [] },
    total: { type: Object, default: {education: 0, food: 0} },
    paid: { type: Number, default: 0 },
    health: { type: Object, default: {illnesses: [], medicines: [], report: ''} },
    special: {type: Array, default: []}
})


const Students = mongoose.model("Students", StudentsSchema);
module.exports = Students;