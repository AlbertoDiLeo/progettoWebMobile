const Figurina = require("../models/Figurina");
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

        //console.log("📌 Salvataggio delle figurine nel database...", allPossibleFigurines);
        await Figurina.insertMany(Array.from(allPossibleFigurines));
        //console.log("100 figurine salvate con successo in MongoDB.", allPossibleFigurines);
    } catch (error) {
        console.error("Errore nel popolamento delle figurine:", error);
    }
}


exports.getHeroDetails = async (req, res) => {
    try {
        const heroId = req.params.id;
        //console.log(`Recupero dettagli per eroe ID: ${heroId}`);

        const response = await getFromMarvel(`public/characters/${heroId}`);
        //console.log("Risposta API Marvel:", response);


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


/*exports.getHeroComics = async (req, res) => {
    try {
        const heroId = req.params.id;
        console.log(`Recupero fumetti per eroe ID: ${heroId}`);

        const response = await getFromMarvel(`public/characters/${heroId}/comics`);
        
        if (!response || !response.data || !response.data.results.length) {
            return res.status(404).json({ message: "Nessun fumetto trovato" });
        }

        const comics = response.data.results.map(comic => ({
            title: comic.title,
            thumbnail: {
                path: comic.thumbnail.path,
                extension: comic.thumbnail.extension
            }
        }));

        res.json(comics);
    } catch (error) {
        console.error("Errore nel recupero dei fumetti:", error);
        res.status(500).json({ message: "Errore nel recupero dei fumetti", error });
    }
};*/
