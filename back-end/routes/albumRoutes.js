const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { createAlbum, getAlbum, buyPack, addToAlbum } = require('../controllers/albumController');

const router = express.Router();

router.post('/', authenticateToken, createAlbum);

router.get('/', authenticateToken, getAlbum);

router.post('/buy-pack', authenticateToken, buyPack);

router.post('/add-to-album', authenticateToken, addToAlbum);

module.exports = router;
