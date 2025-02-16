const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Album = require("../models/album");
const Exchange = require("../models/exchange");
const mongoose = require("mongoose");



exports.getUserProfile = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
            return res.status(400).json({ message: "ID utente non valido" });
        }
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato" });
        }
        res.json(user);
    } catch (err) {
        console.error("Errore del server:", err);
        res.status(500).json({ message: "Errore del server" });
    }
};


exports.updateUserProfile = async (req, res) => {
    try {
        const { name, favoriteHero, birthDate, phone } = req.body;
        const userId = req.params.id;

        if (req.user.userId !== userId) {  
            return res.status(403).json({ error: "Non autorizzato" });
        }

        if (name && name.trim() !== "") {
            const existingUser = await User.findOne({ name });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({ error: "Nome utente già in uso. Scegline un altro." });
            }
        }
        
         const today = new Date().toISOString().split("T")[0]; // Ottieni la data di oggi nel formato YYYY-MM-DD
         if (birthDate && birthDate > today) {
            return res.status(400).json({ error: "La data di nascita non è valida!" });
         }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, favoriteHero, birthDate, phone },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "Utente non trovato" });
        }

        const newToken = jwt.sign(
            { userId: updatedUser._id, 
                name: updatedUser.name, 
                favoriteHero: updatedUser.favoriteHero,
                birthDate: updatedUser.birthDate, 
                phone: updatedUser.phone
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({ message: "Profilo aggiornato con successo!", newToken, updatedUser });


    } catch (error) {
        console.error("Errore durante l'aggiornamento del profilo:", error);
        res.status(500).json({ error: `Errore del server: ${error.message}` });
    }
};



exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Utente non trovato." });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Vecchia password errata." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password aggiornata con successo!" });

    } catch (error) {
        console.error("Errore durante il cambio password:", error);
        res.status(500).json({ error: "Errore del server." });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.userId; // L'ID utente è già nel token, quindi lo usiamo direttamente.

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "ID utente non valido." });
        }

        // **Controlliamo se l'utente ha scambi pendenti**
        const activeExchanges = await Exchange.countDocuments({ offeredBy: userId, status: "pending" });

        if (activeExchanges > 0) {
            return res.status(403).json({ error: "Impossibile eliminare l'account: hai scambi pendenti." });
        }

        // **Se non ci sono scambi pendenti, eliminiamo l'account**
        await Album.findOneAndDelete({ userId }); 
        await User.findByIdAndDelete(userId);

        res.json({ message: "Account eliminato con successo!" });

    } catch (error) {
        console.error("Errore durante l'eliminazione dell'account:", error);
        res.status(500).json({ error: "Errore del server." });
    }
};




exports.buyCredits = async (req, res) => {
    try {
        const { amount } = req.body;  // Numero di crediti da acquistare
        const userId = req.user.userId; 

        if (amount <= 0) {
            return res.status(400).json({ message: "Devi acquistare almeno 1 credito." });
        }

        // Aggiorniamo il saldo crediti dell'utente
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { credits: amount } },  // Aggiungiamo i crediti
            { new: true }
        );

        res.json({ message: "Crediti acquistati con successo!", credits: user.credits });
    } catch (error) {
        console.error("Errore nell'acquisto dei crediti:", error);
        res.status(500).json({ message: "Errore nell'acquisto dei crediti." });
    }
};
