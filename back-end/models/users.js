const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definizione dello schema utente
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favoriteHero: { type: String, required: true },
});

// Hashing della password prima di salvare l'utente
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10); // Cripta la password
    next();
});

// Metodo per confrontare le password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
