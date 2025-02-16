const express = require('express');
//const { authenticateToken } = require('../middlewares/authMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { createExchange, getMyExchanges, withdrawExchange, getAvailableExchanges, getMultiploExchanges  } = require('../controllers/exchangeController');
const { getCreditiExchanges, acceptExchange, rejectExchange } = require('../controllers/exchangeController');

const router = express.Router();


/**
 * @swagger
 * /api/exchange:
 *   post:
 *     summary: Crea una proposta di scambio
 *     tags: [Exchange]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               offeredFigurines:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idMarvel:
 *                       type: string
 *                     name:
 *                       type: string
 *               requestedFigurines:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idMarvel:
 *                       type: string
 *                     name:
 *                       type: string
 *               creditAmount:
 *                 type: integer
 *                 example: 50
 *               type:
 *                 type: string
 *                 enum: [doppioni, multiplo, crediti]
 *     responses:
 *       201:
 *         description: Scambio creato con successo
 *       400:
 *         description: Errore nei dati inviati o figurine non disponibili
 *       404:
 *         description: Album non trovato
 *       500:
 *         description: Errore interno del server
 */
// Creare una proposta di scambio
router.post('/', authMiddleware, createExchange);



/**
 * @swagger
 * /api/exchange/mine:
 *   get:
 *     summary: Recupera gli scambi proposti dall'utente autenticato
 *     tags: [Exchange]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista degli scambi proposti recuperata con successo
 *       500:
 *         description: Errore nel recupero degli scambi proposti
 */
// Recuperare la lista degli scambi proposti dall'utente
router.get('/mine', authMiddleware, getMyExchanges);


/**
 * @swagger
 * /api/exchange/{id}:
 *   delete:
 *     summary: Ritira uno scambio proposto
 *     tags: [Exchange]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dello scambio da ritirare
 *     responses:
 *       200:
 *         description: Scambio ritirato con successo
 *       400:
 *         description: Non autorizzato o scambio non valido
 *       404:
 *         description: Album non trovato
 *       500:
 *         description: Errore interno del server
 */
// Ritirare uno scambio esistente
router.delete('/:id', authMiddleware, withdrawExchange);



/**
 * @swagger
 * /api/exchange/available:
 *   get:
 *     summary: Recupera gli scambi disponibili di tipo doppioni (una figurina per una figurina, nessuno può ricevere una figurina che già possiede)
 *     tags: [Exchange]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista degli scambi disponibili di tipo doppioni
 *       500:
 *         description: Errore nel recupero degli scambi disponibili
 */
// Recuperare la lista degli scambi disponibili (gli scambi che può accettare l'utente) doppioni
router.get('/available', authMiddleware, getAvailableExchanges);



/**
 * @swagger
 * /api/exchange/available/multiplo:
 *   get:
 *     summary: Recupera gli scambi disponibili di tipo multiplo (una o piu' figurine per una o piu' figurine)
 *     tags: [Exchange]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista degli scambi multipli disponibili
 *       500:
 *         description: Errore nel recupero degli scambi multipli disponibili
 */
// Recuperare la lista degli scambi disponibili (gli scambi che può accettare l'utente) multiplo
router.get('/available/multiplo', authMiddleware, getMultiploExchanges);



/**
 * @swagger
 * /api/exchange/available/crediti:
 *   get:
 *     summary: Recupera gli scambi disponibili di tipo crediti (offro una o piu' figurine per crediti)
 *     tags: [Exchange]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista degli scambi per crediti disponibili
 *       500:
 *         description: Errore nel recupero degli scambi per crediti disponibili
 */
// Recuperare la lista degli scambi disponibili (gli scambi che può accettare l'utente) per crediti
router.get('/available/crediti', authMiddleware, getCreditiExchanges);



/**
 * @swagger
 * /api/exchange/{id}/accept:
 *   put:
 *     summary: Accetta uno scambio esistente
 *     tags: [Exchange]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dello scambio da accettare
 *     responses:
 *       200:
 *         description: Scambio accettato con successo
 *       400:
 *         description: Non autorizzato o crediti insufficienti
 *       404:
 *         description: Scambio o album non trovato
 *       500:
 *         description: Errore interno del server
 */
// Accettare uno scambio esistente
router.put('/:id/accept', authMiddleware, acceptExchange);




/**
 * @swagger
 * /api/exchange/{id}/reject:
 *   put:
 *     summary: Rifiuta uno scambio esistente
 *     tags: [Exchange]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dello scambio da rifiutare
 *     responses:
 *       200:
 *         description: Scambio rifiutato con successo
 *       404:
 *         description: Scambio non trovato o già concluso
 *       500:
 *         description: Errore interno del server
 */
// Rifiutare uno scambio esistente
router.put('/:id/reject', authMiddleware, rejectExchange);




module.exports = router;



