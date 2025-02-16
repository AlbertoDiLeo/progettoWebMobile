const express = require('express');
const { login, register } = require("../controllers/authController");

const router = express.Router();



/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuovo utente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mario Rossi
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mario.rossi@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               favoriteHero:
 *                 type: string
 *                 example: Spider-Man
 *     responses:
 *       201:
 *         description: Registrazione completata
 *       400:
 *         description: Dati mancanti o non validi (username o email già in uso)
 *         content:
 *           application/json:
 *             example:
 *               messages: ["Username già in uso", "Email già registrata"]
 *       500:
 *         description: Errore durante la registrazione
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Effettua il login di un utente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mario.rossi@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Accesso riuscito, restituisce il token JWT
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               message: "Accesso riuscito"
 *       401:
 *         description: Password errata
 *       404:
 *         description: Utente non trovato
 *       500:
 *         description: Errore durante il login
 */
router.post("/login", login);



module.exports = router;
