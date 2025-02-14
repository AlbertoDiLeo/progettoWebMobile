const express = require('express');
//const { authenticateToken } = require('../middlewares/authMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { createExchange, getMyExchanges, withdrawExchange } = require('../controllers/exchangeController');

const router = express.Router();



// Creare una proposta di scambio
router.post('/', authMiddleware, createExchange);

// Recuperare la lista degli scambi proposti dall'utente
router.get('/mine', authMiddleware, getMyExchanges);

// Ritirare uno scambio esistente
router.delete('/:id', authMiddleware, withdrawExchange);

// Recuperare la lista degli scambi disponibili
//router.get('/', authMiddleware, getExchanges);

// Accettare uno scambio esistente
//router.put('/:id/accept', authMiddleware, acceptExchange);

// Rifiutare uno scambio esistente
//router.put('/:id/reject', authMiddleware, rejectExchange);




module.exports = router;



