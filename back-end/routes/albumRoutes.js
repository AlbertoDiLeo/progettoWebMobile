const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');  
const { createAlbum, getAlbum, buyPack, addToAlbum } = require('../controllers/albumController');

const router = express.Router();

/**
 * @swagger
 * /api/album:
 *   post:
 *     summary: Crea un nuovo album per l'utente autenticato
 *     tags: [Album]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Album creato con successo
 *         content:
 *           application/json:
 *             example:
 *               message: "Album creato con successo"
 *               album:
 *                 userId: "60d0fe4f5311236168a109ca"
 *                 figurine: []
 *       400:
 *         description: Album già esistente
 *       500:
 *         description: Errore nella creazione dell'album
 */
router.post('/', authenticateToken, createAlbum);

/**
 * @swagger
 * /api/album:
 *   get:
 *     summary: Ottiene l'album completo dell'utente autenticato
 *     tags: [Album]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Album recuperato con successo
 *         content:
 *           application/json:
 *             example:
 *               figurine:
 *                 - idMarvel: "1011334"
 *                   name: "Spider-Man"
 *                   image: "https://example.com/spiderman.jpg"
 *                   found: true
 *                   count: 2
 *       404:
 *         description: Album non trovato
 *       500:
 *         description: Errore nel recupero dell'album
 */
router.get('/', authMiddleware, getAlbum);

/**
 * @swagger
 * /api/album/buy-pack:
 *   post:
 *     summary: Acquista un pacchetto di 5 figurine
 *     tags: [Album]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pacchetto acquistato con successo, restituisce le figurine trovate
 *         content:
 *           application/json:
 *             example:
 *               figurine:
 *                 - idMarvel: "1011334"
 *                   name: "Spider-Man"
 *                   image: "https://example.com/spiderman.jpg"
 *               credits: 4
 *       400:
 *         description: Crediti insufficienti
 *       404:
 *         description: Album o utente non trovato
 *       500:
 *         description: Errore nell'acquisto del pacchetto
 */
router.post('/buy-pack', authMiddleware, buyPack);

/**
 * @swagger
 * /api/album/add-to-album:
 *   post:
 *     summary: Aggiunge una figurina all'album dell'utente
 *     tags: [Album]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idMarvel:
 *                 type: string
 *                 example: "1011334"
 *               name:
 *                 type: string
 *                 example: "Spider-Man"
 *               image:
 *                 type: string
 *                 example: "https://example.com/spiderman.jpg"
 *     responses:
 *       200:
 *         description: Figurine aggiunte all'album con successo
 *         content:
 *           application/json:
 *             example:
 *               message: "Figurine aggiunte all'album"
 *               album:
 *                 userId: "60d0fe4f5311236168a109ca"
 *                 figurine:
 *                   - idMarvel: "1011334"
 *                     name: "Spider-Man"
 *                     image: "https://example.com/spiderman.jpg"
 *                     count: 2
 *       400:
 *         description: Dati mancanti
 *       404:
 *         description: Album non trovato
 *       500:
 *         description: Errore nell'aggiunta delle figurine
 */
router.post('/add-to-album', authenticateToken, addToAlbum);


module.exports = router;
