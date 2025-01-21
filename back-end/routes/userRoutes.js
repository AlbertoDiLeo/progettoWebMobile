const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const User = require("../models/user");

// Rotta per ottenere il profilo
router.get("/profile", authenticateToken, async (req, res) => {
    try {
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
});

module.exports = router;
