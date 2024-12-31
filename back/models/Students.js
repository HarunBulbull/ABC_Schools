const mongoose = require("mongoose");


const StudentsSchema = mongoose.Schema({
    id: { type: String, required: true },
    old: { type: Object, default: {education: 0, food: 0} },
    new: { type: Object, default: {education: 0, food: 0} },
    paid: { type: Number, default: 0 },
    health: { type: Object, default: {illnesses: [], medicines: [], report: ''} },
    discounts: {type: Array, default: []},
    scholarship: {type: Number, default: 0}
})


const Students = mongoose.model("Students", StudentsSchema);
module.exports = Students;