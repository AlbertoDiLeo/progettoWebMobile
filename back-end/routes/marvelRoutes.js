const express = require("express");
const router = express.Router();
const { getHeroDetails } = require("../controllers/marvelController");
const Figurina = require("../models/figurina");

// Rotta per ottenere i dettagli di un supereroe specifico
router.get("/hero/:id", getHeroDetails);


router.get("/heroes", async (req, res) => {
    try {
      const heroes = await Figurina.find({}, "name").lean(); // lean() migliora la performance
      const heroNames = heroes.map(hero => hero.name);
      res.json(heroNames);
    } catch (error) {
      console.error("Errore backend nel recupero degli eroi:", error.message);
      res.status(500).json({ error: `Errore nel recupero degli eroi: ${error.message}` });
    }
});
  


module.exports = router;
