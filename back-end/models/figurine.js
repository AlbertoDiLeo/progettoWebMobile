const mongoose = require("mongoose");

const figurineSchema = new mongoose.Schema({
    idMarvel: { type: String, required: true, unique: true }, // ID della figurina su Marvel
    name: { type: String, required: true },
    image: { type: String, required: true } // Ora salviamo solo nome e immagine
});

module.exports = mongoose.model("Figurine", figurineSchema);

