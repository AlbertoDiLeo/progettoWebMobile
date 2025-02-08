const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const { createAlbum, getAlbum } = require('../controllers/albumController');
const authMiddleware = require('../middlewares/authMiddleware');  // Middleware di autenticazione

const router = express.Router();

router.post('/', authenticateToken, createAlbum);

router.get('/', authMiddleware, getAlbum);

module.exports = router;
