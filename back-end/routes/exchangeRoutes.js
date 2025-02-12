
const express = require('express');
//const { authenticateToken } = require('../middlewares/authMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { getExchanges, createExchange, acceptExchange, rejectExchange, withdrawExchange } = require('../controllers/exchangeController');

const router = express.Router();

// Recuperare la lista degli scambi disponibili
router.get('/', authMiddleware, getExchanges);

// Creare una proposta di scambio
router.post('/', authMiddleware, createExchange);

// Accettare uno scambio esistente
router.put('/:id/accept', authMiddleware, acceptExchange);

// Rifiutare uno scambio esistente
router.put('/:id/reject', authMiddleware, rejectExchange);

// Ritirare uno scambio esistente
router.delete('/:id', authMiddleware, withdrawExchange);


module.exports = router;
