const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authenticateToken = require("../middlewares/authMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const { updateUserProfile, getUserProfile } = require("../controllers/userController");
const { changePassword } = require("../controllers/userController");
const { deleteAccount } = require("../controllers/userController");
const { buyCredits } = require('../controllers/userController');


router.get("/profile", authenticateToken, );

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

router.put("/change-password", authenticateToken, changePassword);

router.delete("/delete/:id", authenticateToken, deleteAccount);

router.post('/buy-credits', authMiddleware, buyCredits);



module.exports = router;
