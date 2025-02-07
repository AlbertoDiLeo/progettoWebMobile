const mongoose = require('mongoose');

// Definizione dello schema utente
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favoriteHero: { type: String, required: true },
    birthDate: { type: Date, default: null }, // Campo opzionale
    phone: { type: String, match: /^[0-9]{10,15}$/, default: null }, // Campo opzionale
    //createdAt: { type: Date, default: Date.now }, // Imposta la data di registrazione automaticamente
});

module.exports = mongoose.model('User', userSchema);
