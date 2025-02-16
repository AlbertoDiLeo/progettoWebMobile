const Figurina = require("../models/figurina");
const { getFromMarvel } = require("../marvel");
const { getRandomInt } = require("../marvel");

exports.populateFigurine = async () => {
    try {
        const count = await Figurina.countDocuments();
        if (count > 0) {
            console.log("La collection 'figurine' è già popolata.");
            return;
        }

        const totalResponse = await getFromMarvel("public/characters", "limit=1");
        const TOTAL_HEROES = totalResponse.data.total;

        //console.log("Recupero 100 eroi casuali dalla Marvel...");

        let selectedHeroIds = new Set();
        let allPossibleFigurines = [];

        while (selectedHeroIds.size < 100) {
            const randomOffset = getRandomInt(0, TOTAL_HEROES - 1);
            const response = await getFromMarvel("public/characters", `limit=1&offset=${randomOffset}`);
            const hero = response.data.results[0];

            if (hero && !selectedHeroIds.has(hero.id)) {
                selectedHeroIds.add(hero.id);
                allPossibleFigurines.push({
                    idMarvel: hero.id.toString(),
                    name: hero.name,
                    image: `${hero.thumbnail.path}.${hero.thumbnail.extension}`
                });
            }
        }

        await Figurina.insertMany(Array.from(allPossibleFigurines));
        //console.log("100 figurine salvate con successo in MongoDB.", allPossibleFigurines);
    } catch (error) {
        console.error("Errore nel popolamento delle figurine:", error);
    }
}


exports.getHeroDetails = async (req, res) => {
    try {
        const heroId = req.params.id;

        const response = await getFromMarvel(`public/characters/${heroId}`);

        if (!response || !response.data || !response.data.results.length) {
            return res.status(404).json({ message: "Eroe non trovato nella Marvel API" });
        }

        const hero = response.data.results[0];

        const heroDetails = {
            idMarvel: hero.id.toString(),
            name: hero.name,
            description: hero.description || "Nessuna descrizione disponibile",
            image: `${hero.thumbnail.path}.${hero.thumbnail.extension}`,
            series: hero.series.items.map(s => s.name),
            events: hero.events.items.map(e => e.name),
            comics: hero.comics.items.map(c => c.name)
        };

        res.json(heroDetails);
    } catch (error) {
        console.error("Errore nel recupero dei dettagli dell'eroe:", error);
        res.status(500).json({ message: "Errore nel recupero dei dettagli dell'eroe", error });
    }
};


exports.getHeroNames = async (req, res) => {
    try {
        const heroes = await Figurina.find({}, "name").lean(); // lean() migliora la performance
        const heroNames = heroes.map(hero => hero.name);
        res.json(heroNames);
    } catch (error) {
        console.error("Errore backend nel recupero degli eroi:", error.message);
        res.status(500).json({ error: `Errore nel recupero degli eroi: ${error.message}` });
    }
};


