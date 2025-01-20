const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definizione dello schema utente
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favoriteHero: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }, // Imposta la data di registrazione automaticamente
});

module.exports = mongoose.model('User', userSchema);
