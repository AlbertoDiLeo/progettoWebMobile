const express = require("express");
const router = express.Router();
const { getHeroDetails, getHeroNames } = require("../controllers/marvelController");

/**
 * @swagger
 * /api/marvel/hero/{id}:
 *   get:
 *     summary: Ottiene i dettagli di un eroe Marvel tramite ID
 *     tags: [Marvel]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dell'eroe Marvel
 *     responses:
 *       200:
 *         description: Dettagli dell'eroe recuperati con successo
 *         content:
 *           application/json:
 *             example:
 *               idMarvel: "1011334"
 *               name: "Spider-Man"
 *               description: "Supereroe con poteri di ragno"
 *               image: "https://example.com/spiderman.jpg"
 *               series: ["Ultimate Spider-Man", "The Amazing Spider-Man"]
 *               events: ["Secret Wars", "Infinity Gauntlet"]
 *               comics: ["The Amazing Spider-Man #1", "Spider-Verse"]
 *       404:
 *         description: Eroe non trovato nella Marvel API
 *       500:
 *         description: Errore nel recupero dei dettagli dell'eroe
 */
router.get("/hero/:id", getHeroDetails);

/**
 * @swagger
 * /api/marvel/heroes:
 *   get:
 *     summary: Ottiene l'elenco di tutti i nomi degli eroi Marvel salvati
 *     tags: [Marvel]
 *     responses:
 *       200:
 *         description: Elenco degli eroi recuperato con successo
 *         content:
 *           application/json:
 *             example:
 *               - "Spider-Man"
 *               - "Iron Man"
 *               - "Captain America"
 *       500:
 *         description: Errore nel recupero degli eroi
 */
router.get("/heroes", getHeroNames);


module.exports = router;
