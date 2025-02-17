const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Album = require("../models/album");


exports.register = async (req, res) => {
    try {
            const { name, email, password, favoriteHero } = req.body;
            let errors = [];
    
            const existingName = await User.findOne({ name });
            if (existingName) errors.push('Username già in uso');
    
            const existingUser = await User.findOne({ email });
            if (existingUser) errors.push('Email già registrata');
    
            if (errors.length > 0) {
                return res.status(400).json({ messages: errors });
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                favoriteHero,
            });
    
            await newUser.save();

            try {
                const newAlbum = new Album({
                    userId: newUser._id,
                    figurine: []
                });
                await newAlbum.save();
                
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

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password errata" });
        }

        const token = jwt.sign(
            {
                userId: user._id,  
                name: user.name,
                //email: user.email,
                //favoriteHero: user.favoriteHero,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, message: "Accesso riuscito" });
    } catch (err) {
        res.status(500).json({ message: "Errore durante il login", error: err.message });
    }
};
