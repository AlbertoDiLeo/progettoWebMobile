const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
    createExchange,
    acceptExchange,
    rejectExchange,
    withdrawExchange,
    getExchanges
} = require("../controllers/exchangeController");

const router = express.Router();

// **Rotte per gestire gli scambi**
router.get("/", authenticateToken, getExchanges); 
router.post("/", authenticateToken, createExchange); 
router.put("/:id/accept", authenticateToken, acceptExchange); 
router.put("/:id/reject", authenticateToken, rejectExchange); 
router.delete("/:id", authenticateToken, withdrawExchange); 

module.exports = router;




