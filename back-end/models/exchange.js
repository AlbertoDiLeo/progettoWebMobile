const mongoose = require("mongoose");


const exchangeSchema = new mongoose.Schema({
    offeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    offeredFigurines: [{
      idMarvel: { type: String, required: true },
      name: { type: String, required: true }  
    }],
    requestedFigurines: [{
      idMarvel: { type: String, required: function() { return this.type !== "crediti"; } },
      name: { type: String, required: function() { return this.type !== "crediti"; } } 
    }],
    creditAmount: { type: Number, default: 0 },
    type: { type: String, enum: ["doppioni", "multiplo", "crediti"], required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
});

//module.exports = mongoose.model("Exchange", exchangeSchema);

module.exports = mongoose.models.Exchange || mongoose.model("Exchange", exchangeSchema);

