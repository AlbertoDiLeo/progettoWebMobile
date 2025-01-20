const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const router = express.Router();


// Middleware per autenticare il token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Accesso negato. Token mancante.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token non valido.' });
        }
        req.user = user; // Aggiunge i dati utente al `req` per l'uso successivo
        next();
    });
};

// Rotta di registrazione
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, favoriteHero } = req.body;
        console.log('Dati ricevuti per la registrazione:', { name, email, password, favoriteHero });


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
/*router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Controlla se l'utente esiste
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' }); // Email non registrata
        }

        // Verifica la password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            console.error('Errore: Password errata.');
            return res.status(401).json({ message: 'Password errata' }); // Password sbagliata
        }
        console.log('Password verificata con successo.');

        // Genera il token JWT includendo i campi necessari
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                favoriteHero: user.favoriteHero,
                //createdAt: user.createdAt
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log('Token generato:', token);

        res.status(200).json({ token, message: 'Accesso riuscito' });
    } catch (err) {
        res.status(500).json({ message: 'Errore durante il login', error: err.message });
    }
});*/



router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Dati ricevuti per il login:', { email, password });

        // Trova l'utente
        const user = await User.findOne({ email });
        if (!user) {
            console.error('Errore: Utente non trovato.');
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        console.log('Utente trovato:', user);

        // Verifica la password
        try {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('Confronto password:', {
                inserita: password,
                salvata: user.password,
                valida: isPasswordValid,
            });

            if (!isPasswordValid) {
                console.error('Errore: Password errata.');
                return res.status(401).json({ message: 'Password errata' });
            }

            console.log('Password verificata con successo.');

            // Genera il token JWT
            const token = jwt.sign(
                { id: user._id, name: user.name, email: user.email, favoriteHero: user.favoriteHero },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            console.log('Token generato:', token);

            res.status(200).json({ token, message: 'Login riuscito' });
        } catch (compareError) {
            console.error('Errore durante il confronto delle password:', compareError.message);
            return res.status(500).json({ message: 'Errore durante il confronto delle password' });
        }
    } catch (err) {
        console.error('Errore durante il login:', err.message);
        res.status(500).json({ message: 'Errore durante il login', error: err.message });
    }
});





router.get('/test-login', async (req, res) => {
    try {
        const User = require('../models/user');
        const user = await User.findOne({ email: 'mario.rossi@example.com' });
        if (!user) return res.status(404).send('Utente non trovato');

        const isPasswordValid = await user.comparePassword('password123');
        if (!isPasswordValid) return res.status(401).send('Password errata');

        res.send('Login riuscito!');
    } catch (err) {
        res.status(500).send('Errore nel login: ' + err.message);
    }
});
// http://localhost:5000/api/auth/test-login



// Rotta per aggiornare il profilo utente
router.put('/update', authenticateToken, async (req, res) => {
    const { name, favoriteHero, birthDate, phone } = req.body;

    try {
        const updates = { name, favoriteHero, birthDate, phone };
        const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true });

        res.status(200).json({ message: 'Profilo aggiornato con successo', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Errore durante l\'aggiornamento del profilo', error: error.message });
    }
});




// Rotta per cambiare la password
router.post('/change-password', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'La vecchia password non è corretta' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Password aggiornata con successo' });
    } catch (error) {
        res.status(500).json({ message: 'Errore durante la modifica della password', error: error.message });
    }
});


router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: 'Account eliminato con successo' });
    } catch (error) {
        res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'account', error: error.message });
    }
});


module.exports = router;
