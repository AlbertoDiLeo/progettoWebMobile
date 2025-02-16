const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getUserProfile, updateUserProfile,  getUserById} = require("../controllers/userController");
const { checkUsername } = require("../controllers/userController");
const { changePassword } = require("../controllers/userController");
const { deleteAccount } = require("../controllers/userController");
const { buyCredits } = require('../controllers/userController');


/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Ottiene il profilo dell'utente autenticato
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profilo utente recuperato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: ID utente non valido
 *       404:
 *         description: Utente non trovato
 *       500:
 *         description: Errore del server
 */
router.get("/profile", authMiddleware, getUserProfile);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Aggiorna il profilo di un utente
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dell'utente da aggiornare
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
 *               favoriteHero:
 *                 type: string
 *                 example: Spider-Man
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 1990-05-20
 *               phone:
 *                 type: string
 *                 example: 1234567890
 *     responses:
 *       200:
 *         description: Profilo aggiornato con successo, restituisce il nuovo token JWT
 *       400:
 *         description: Dati non validi o nome utente già in uso
 *       403:
 *         description: Non autorizzato
 *       404:
 *         description: Utente non trovato
 *       500:
 *         description: Errore del server
 */
router.put("/:id", authMiddleware, updateUserProfile);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Ottiene un utente tramite ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dettagli utente recuperati con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utente non trovato
 *       401:
 *         description: Non autorizzato
 *       500:
 *         description: Errore del server
 */
router.get("/:id", authMiddleware, getUserById);

/**
 * @swagger
 * /api/user/check-username/{name}:
 *   get:
 *     summary: Controlla se uno username è disponibile
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Username da controllare
 *     responses:
 *       200:
 *         description: Indica se lo username è disponibile o meno
 *         content:
 *           application/json:
 *             example:
 *               available: true
 *       500:
 *         description: Errore nel controllo del nome utente
 */
router.get("/check-username/:name", checkUsername);

/**
 * @swagger
 * /api/user/change-password/{id}:
 *   put:
 *     summary: Cambia la password di un utente
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dell'utente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: VecchiaPassword123
 *               newPassword:
 *                 type: string
 *                 example: NuovaPassword456
 *     responses:
 *       200:
 *         description: Password aggiornata con successo
 *       400:
 *         description: Vecchia password errata
 *       403:
 *         description: Non autorizzato
 *       404:
 *         description: Utente non trovato
 *       500:
 *         description: Errore del server
 */
router.put("/change-password/:id", authMiddleware, changePassword);

/**
 * @swagger
 * /api/user/delete/{id}:
 *   delete:
 *     summary: Elimina l'account di un utente
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dell'utente da eliminare
 *     responses:
 *       200:
 *         description: Account eliminato con successo
 *       400:
 *         description: ID utente non valido
 *       403:
 *         description: Impossibile eliminare l'account: scambi pendenti
 *       404:
 *         description: Utente non trovato
 *       500:
 *         description: Errore del server
 */
router.delete("/delete/:id", authMiddleware, deleteAccount);

/**
 * @swagger
 * /api/user/buy-credits:
 *   post:
 *     summary: Acquista crediti
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *                 example: 100
 *                 description: Numero di crediti da acquistare (minimo 1)
 *     responses:
 *       200:
 *         description: Crediti acquistati con successo, restituisce il saldo aggiornato
 *         content:
 *           application/json:
 *             example:
 *               message: "Crediti acquistati con successo!"
 *               credits: 500
 *       400:
 *         description: Devi acquistare almeno 1 credito
 *       401:
 *         description: Non autorizzato
 *       500:
 *         description: Errore del server
 */
router.post('/buy-credits', authMiddleware, buyCredits);



module.exports = router;