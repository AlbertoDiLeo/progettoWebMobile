
const express = require('express');
//const { authenticateToken } = require('../middlewares/authMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { getExchanges, createExchange, acceptExchange } = require('../controllers/exchangeController');

const router = express.Router();

// Recuperare la lista degli scambi disponibili
router.get('/', authMiddleware, getExchanges);

// Creare una proposta di scambio
router.post('/', authMiddleware, createExchange);

// Accettare uno scambio esistente
router.put('/:id/accept', authMiddleware, acceptExchange);

module.exports = router;
