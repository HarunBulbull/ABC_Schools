const mongoose = require("mongoose");


const CountsSchema = mongoose.Schema({
    anaokulu: { type: Object, required: true },
    ilkokul: { type: Object, required: true },
    ortaokul: { type: Object, required: true },
    anadolu: { type: Object, required: true },
    fen: { type: Object, required: true },
    indirimler: { type: Object, required: true },
})


const Counts = mongoose.model("Counts", CountsSchema);
module.exports = Counts;