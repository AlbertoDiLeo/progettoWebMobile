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
 *     responses:
 *       default:
 *         description: ""
 */
router.post("/login", login);

module.exports = router;
