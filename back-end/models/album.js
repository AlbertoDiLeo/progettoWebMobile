const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    figurine: [{
        idMarvel: String,  // ID della figurina su Marvel
        name: String,
        description: String,
        image: String,
        series: [String], // Serie in cui compare
        events: [String], // Eventi in cui compare
        comics: [String], // Fumetti in cui compare
    }],
    count: { type: Number, default: 1 }  // Numero di copie possedute
});

module.exports = mongoose.model('Album', albumSchema);
