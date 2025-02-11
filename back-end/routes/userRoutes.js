const express = require("express");
const User = require("../models/user");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { updateUserProfile } = require("../controllers/userController");
const { changePassword } = require("../controllers/userController");
const { deleteAccount } = require("../controllers/userController");
const { buyCredits } = require('../controllers/userController');
const mongoose = require("mongoose");

const router = express.Router();


router.get("/profile", authMiddleware, async (req, res) => {
    try {
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
        console.error("Errore del server:", err);
        res.status(500).json({ message: "Errore del server" });
    }
});

router.put("/users/:id", authenticateToken, updateUserProfile); //sistemare percorso

router.get("/users/:id", authenticateToken, async (req, res) => { //sistemare percorso
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

router.put("/change-password", authenticateToken, changePassword);

router.delete("/delete/:id", authenticateToken, deleteAccount);

router.post('/buy-credits', authenticateToken, buyCredits);



module.exports = router;
