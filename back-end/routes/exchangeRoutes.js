const express = require('express');
//const { authenticateToken } = require('../middlewares/authMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { createExchange, getMyExchanges, withdrawExchange, getAvailableExchanges, getMultiploExchanges  } = require('../controllers/exchangeController');
const { getCreditiExchanges, acceptExchange, rejectExchange } = require('../controllers/exchangeController');

const router = express.Router();



// Creare una proposta di scambio
router.post('/', authMiddleware, createExchange);

// Recuperare la lista degli scambi proposti dall'utente
router.get('/mine', authMiddleware, getMyExchanges);

// Ritirare uno scambio esistente
router.delete('/:id', authMiddleware, withdrawExchange);

// Recuperare la lista degli scambi disponibili (gli scambi che può accettare l'utente) doppioni
router.get('/available', authMiddleware, getAvailableExchanges);

// Recuperare la lista degli scambi disponibili (gli scambi che può accettare l'utente) multiplo
router.get('/available/multiplo', authMiddleware, getMultiploExchanges);

// Recuperare la lista degli scambi disponibili (gli scambi che può accettare l'utente) per crediti
router.get('/available/crediti', authMiddleware, getCreditiExchanges);

// Accettare uno scambio esistente
router.put('/:id/accept', authMiddleware, acceptExchange);

// Rifiutare uno scambio esistente
router.put('/:id/reject', authMiddleware, rejectExchange);




module.exports = router;



