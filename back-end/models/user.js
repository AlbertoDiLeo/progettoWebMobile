const mongoose = require('mongoose');

// Definizione dello schema utente
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favoriteHero: { type: String, required: true },
    birthDate: { type: Date, default: null }, // Campo opzionale
    phone: { type: String, match: /^[0-9]{10,15}$/, default: null }, // Campo opzionale
    credits: { type: Number, default: 0, required: true },
});

//module.exports = mongoose.model("User", userSchema);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);