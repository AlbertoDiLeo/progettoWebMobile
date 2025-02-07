const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const User = require("../models/user");
const { updateUserProfile } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");


// Rotta per ottenere il profilo
/*router.get("/profile", authenticateToken, async (req, res) => {
    try {
        //console.log("🔹 Richiesta ricevuta per /api/user/profile"); // Debug
        //console.log("🔹 ID Utente:", req.user.userId);
        // Usa l'ID utente dal token per trovare i dati nel database
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato" });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Errore del server" });
    }
});*/


router.get("/profile", authenticateToken, async (req, res) => {
    try {
        //console.log("🔹 Richiesta ricevuta per /api/user/profile");
        //console.log("🔹 ID Utente dal token:", req.user.userId);

        // Assicuriamoci che sia un ObjectId valido per MongoDB
        if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
            return res.status(400).json({ message: "ID utente non valido" });
        }

        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Utente non trovato" });
        }

        res.json(user);
    } catch (err) {
        console.error("❌ Errore del server:", err);
        res.status(500).json({ message: "Errore del server" });
    }
});

router.put("/users/:id", authMiddleware, updateUserProfile);

router.get("/users/:id", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato" });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Errore del server" });
    }
});

router.get("/check-username/:name", async (req, res) => {
    try {
        const { name } = req.params;

        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.json({ available: false });
        }

        res.json({ available: true });
    } catch (error) {
        res.status(500).json({ error: "Errore nel controllo del nome utente." });
    }
});




module.exports = router;
