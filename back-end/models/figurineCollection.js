const mongoose = require('mongoose');

const figurineSchema = new mongoose.Schema({
    idMarvel: { type: String, required: true, unique: true },  // ID della figurina su Marvel
    name: { type: String, required: true },
    description: { type: String, default: "Nessuna descrizione disponibile" },
    image: { type: String, required: true },
    series: [String],  // Serie in cui compare
    events: [String],  // Eventi in cui compare
    comics: [String]   // Fumetti in cui compare
});

module.exports = mongoose.model('FigurineCollection', figurineSchema);
