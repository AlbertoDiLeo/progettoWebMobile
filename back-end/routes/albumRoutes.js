const express = require('express');
const { getAlbum } = require('../controllers/albumController');
const authMiddleware = require('../middlewares/authMiddleware');  // Middleware di autenticazione

const router = express.Router();

router.get('/album', authMiddleware, getAlbum);

module.exports = router;
