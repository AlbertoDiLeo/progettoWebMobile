const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authenticateToken = require("../middlewares/authMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const { getUserProfile, updateUserProfile,  getUserById} = require("../controllers/userController");
const { checkUsername } = require("../controllers/userController");
const { changePassword } = require("../controllers/userController");
const { deleteAccount } = require("../controllers/userController");
const { buyCredits } = require('../controllers/userController');


router.get("/profile", authenticateToken, getUserProfile);

router.put("/:id", authMiddleware, updateUserProfile);

router.get("/:id", authenticateToken, getUserById);

router.get("/check-username/:name", checkUsername); 

router.put("/change-password", authenticateToken, changePassword);

router.delete("/delete/:id", authenticateToken, deleteAccount);

router.post('/buy-credits', authMiddleware, buyCredits);



module.exports = router;
