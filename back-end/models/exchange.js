const mongoose = require('mongoose');

const ExchangeSchema = new mongoose.Schema({
    offeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Utente che offre lo scambio
    offeredSticker: { type: mongoose.Schema.Types.ObjectId, ref: 'Figurina', required: true }, // Figurina offerta
    requestedSticker: { type: mongoose.Schema.Types.ObjectId, ref: 'Figurina', required: true }, // Figurina richiesta
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Exchange', ExchangeSchema);
