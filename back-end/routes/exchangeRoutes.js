
const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { createExchange, acceptExchange } = require('../controllers/exchangeController');

const router = express.Router();


// Creare una proposta di scambio
router.post('/exchange', authenticateToken, createExchange);

// Accettare uno scambio esistente
router.put('/exchange/:id/accept', authenticateToken, acceptExchange);

module.exports = router;
