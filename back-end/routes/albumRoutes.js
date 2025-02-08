const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');  // Middleware di autenticazione
const { createAlbum, getAlbum } = require('../controllers/albumController');
const { buyPack } = require('../controllers/albumController');

const router = express.Router();

router.post('/', authenticateToken, createAlbum);

router.get('/', authMiddleware, getAlbum);

router.post('/buy-pack', authMiddleware, buyPack);

module.exports = router;
