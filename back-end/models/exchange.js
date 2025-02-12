const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema({
    offeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    offeredFigurineIds: [{ type: String, required: true }], // ID Marvel delle figurine offerte
    requestedFigurineIds: [{ type: String }], // ID Marvel delle figurine richieste
    creditAmount: { type: Number, default: 0 }, // Solo per scambi in crediti
    type: { type: String, enum: ["doppioni", "multiplo", "crediti"], required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Exchange", exchangeSchema);


