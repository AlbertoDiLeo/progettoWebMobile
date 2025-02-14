const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema({
    offeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Utente che propone lo scambio
    offeredFigurines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Figurina", required: true }], // Figurine offerte
    requestedFigurines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Figurina", required: function() { return this.type !== "crediti"; } }], // Figurine richieste (null per vendita crediti)
    creditAmount: { type: Number, default: 0 }, // Crediti richiesti (solo per vendita)
    type: { type: String, enum: ["doppioni", "multiplo", "crediti"], required: true }, // Tipo di scambio
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
});

//module.exports = mongoose.model("Exchange", exchangeSchema);

const Exchange = mongoose.models.Exchange || mongoose.model("Exchange", exchangeSchema);

