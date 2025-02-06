const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Rotta di registrazione
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, favoriteHero } = req.body;


        // Controlla se l'email è già registrata
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email già registrata' });

        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea un nuovo utente
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            favoriteHero,
            //createdAt: new Date(),
        });

        await newUser.save();

        res.status(201).json({ message: 'Registrazione completata' });
    } catch (err) {
        res.status(500).json({ message: 'Errore durante la registrazione', error: err.message });
    }
});




// Rotta di login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Controlla se l'utente esiste
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' }); // Email non registrata
        }

        // Verifica la password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password errata' }); // Password sbagliata
        }

        // Genera il token JWT includendo i campi necessari
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                favoriteHero: user.favoriteHero,
                createdAt: user.createdAt
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        //console.log('Token generato:', token);

        res.status(200).json({ token, message: 'Accesso riuscito' });
    } catch (err) {
        res.status(500).json({ message: 'Errore durante il login', error: err.message });
    }
});

module.exports = router;
