const express = require('express');
const { login } = require("../controllers/authController");
const { register } = require("../controllers/authController");

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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       default:
 *         description: ""
 */
router.post("/register", register);



/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Effettua il login
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
 *                 example: mario.rossi@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       default:
 *         description: ""
 */
router.post("/login", login);


module.exports = router;
