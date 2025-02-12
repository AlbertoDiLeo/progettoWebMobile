const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Album = require("../models/album");


exports.register = async (req, res) => {
    try {
            const { name, email, password, favoriteHero } = req.body;
            let errors = [];
    
            // Controlla se il nome è già in uso
            const existingName = await User.findOne({ name });
            if (existingName) errors.push('Username già in uso');
    
            // Controlla se l'email è già registrata
            const existingUser = await User.findOne({ email });
            if (existingUser) errors.push('Email già registrata');
    
            // Se ci sono errori, restituiscili tutti insieme
            if (errors.length > 0) {
                return res.status(400).json({ messages: errors });
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Crea un nuovo utente
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                favoriteHero,
            });
    
            await newUser.save();

            // Dopo la creazione dell'utente, creiamo anche il suo album vuoto
            try {
                const newAlbum = new Album({
                    userId: newUser._id,
                    figurine: []
                });
                await newAlbum.save();
                //console.log("Album creato per l'utente:", newUser._id);
                //console.log("Album:", newAlbum);
            } catch (error) {
                console.error("Errore nella creazione dell'album:", error);
            }
    
            res.status(201).json({ message: 'Registrazione completata' });
        } catch (err) {
            res.status(500).json({ message: 'Errore durante la registrazione', error: err.message });
        }
    };

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Controlla se l'utente esiste
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato" });
        }

        // Verifica la password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password errata" });
        }

        // Genera il token JWT includendo i campi necessari
        const token = jwt.sign(
            {
                userId: user._id,  
                name: user.name,
                email: user.email,
                favoriteHero: user.favoriteHero,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, message: "Accesso riuscito" });
    } catch (err) {
        res.status(500).json({ message: "Errore durante il login", error: err.message });
    }
};
