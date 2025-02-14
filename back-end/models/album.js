const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    figurine: [{
        idMarvel: { type: String, required: true },  // ID della figurina Marvel
        name: { type: String, required: true },  // Nome dell'eroe
        image: { type: String, required: true },  // Immagine dell'eroe
        count: { type: Number, default: 1 }  // Contatore per i doppioni
    }]
});

module.exports = mongoose.model("Album", albumSchema);

module.exports = mongoose.models.Album || mongoose.model("Album", albumSchema);