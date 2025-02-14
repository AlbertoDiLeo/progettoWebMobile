
// modello di una singola figurina sulle 100 possibili di Marvel

const mongoose = require("mongoose"); 

const figurinaSchema = new mongoose.Schema({
    idMarvel: { type: String, required: true, unique: true }, // ID della figurina su Marvel
    name: { type: String, required: true },
    image: { type: String, required: true } 
});

//module.exports = mongoose.model("Figurina", figurinaSchema);

module.exports = mongoose.models.Figurina || mongoose.model("Figurina", figurinaSchema);

