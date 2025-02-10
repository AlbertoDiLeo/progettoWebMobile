const express = require("express");
const router = express.Router();
const { getHeroDetails } = require("../controllers/marvelController");
//const { getHeroComics } = require("../controllers/marvelController");

// Rotta per ottenere i dettagli di un supereroe specifico
router.get("/hero/:id", getHeroDetails);

//router.get("/hero/:id/comics", getHeroComics);


module.exports = router;
