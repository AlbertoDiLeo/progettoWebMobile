const express = require('express');
const { createAlbum, getAlbum } = require('../controllers/albumController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware di autenticazione

const router = express.Router();

router.post('/create', authMiddleware, createAlbum);  // Crea un album
router.get('/', authMiddleware, getAlbum);           // Recupera l'album dell'utente

module.exports = router;
