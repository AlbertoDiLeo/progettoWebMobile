const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema({
    offeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Utente che propone lo scambio
    offeredFigurines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Figurina", required: true }], // Figurine offerte
    requestedFigurines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Figurina", required: function() { return this.type !== "crediti"; } }], // Figurine richieste (null per vendita crediti)
    creditAmount: { type: Number, default: 0 }, // Crediti richiesti (solo per vendita)
    type: { type: String, enum: ["doppioni", "multiplo", "crediti"], required: true }, // Tipo di scambio
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
});

module.exports = mongoose.model("Exchange", exchangeSchema);







/*const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema({
    offeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    offeredFigurineIds: [{ type: String, required: true }], // ID Marvel delle figurine offerte
    requestedFigurineIds: [{ type: String }], // ID Marvel delle figurine richieste
    creditAmount: { type: Number, default: 0 }, // Solo per scambi in crediti
    type: { type: String, enum: ["doppioni", "multiplo", "crediti"], required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Exchange", exchangeSchema);*/


/*const exchangeSchema = new mongoose.Schema({
    offeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Utente che offre lo scambio
    offeredFigurina: { type: mongoose.Schema.Types.ObjectId, ref: 'Figurina', required: true }, // Figurina offerta
    requestedFigurina: { type: mongoose.Schema.Types.ObjectId, ref: 'Figurina', required: true }, // Figurina richiesta
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});*/