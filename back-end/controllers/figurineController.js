const Figurine = require("../models/figurine");
const { getFromMarvel } = require("../marvel");
const { getRandomInt } = require("../marvel");


/*exports.populateFigurine = async () => {
    try {
        const count = await Figurine.countDocuments();
        if (count > 0) {
            console.log("La collezione di figurine esiste già.");
            return;
        }

        const totalResponse = await getFromMarvel("public/characters", "limit=1");

        if (!totalResponse || !totalResponse.data || !totalResponse.data.total) {
            console.error("Errore nel recupero del numero totale di eroi.");
            return;
        }

        const TOTAL_HEROES = totalResponse.data.total;
        const ALBUM_HERO_LIMIT = 100;

        //console.log(`🔹 La Marvel ha ${TOTAL_HEROES} eroi disponibili.`);
        
        let selectedHeroes = new Set();
        let allPossibleFigurines = [];

        while (selectedHeroes.size < ALBUM_HERO_LIMIT) {
            const randomOffset = getRandomInt(0, TOTAL_HEROES - 1);
            const response = await getFromMarvel("public/characters", `limit=1&offset=${randomOffset}`);
            
            if (response && response.data && response.data.results.length > 0) {
                const hero = response.data.results[0];

                // Se l'eroe non è già stato selezionato, lo aggiungiamo
                if (!selectedHeroes.has(hero.id)) {
                    selectedHeroes.add(hero.id);
                    allPossibleFigurines.push({
                        idMarvel: hero.id.toString(),
                        name: hero.name,
                        image: `${hero.thumbnail.path}.${hero.thumbnail.extension}`
                    });
                }
            }
        }

        await Figurine.insertMany(allPossibleFigurines);
        //console.log(`${allPossibleFigurines.length} figurine uniche inserite nella collezione globale!`);
    } catch (error) {
        console.error("Errore nel popolamento delle figurine:", error);
    }
};*/

async function populateFigurineCollection() {
    try {
        const count = await Figurine.countDocuments();
        /*if (count > 0) {
            console.log("La collection 'figurine' è già popolata.");
            return;
        }*/

        //console.log("Recupero 100 eroi casuali dalla Marvel...");
        let selectedHeroes = new Set();
        while (selectedHeroes.size < 100) {
            const randomOffset = getRandomInt(0, TOTAL_HEROES - 1);
            const response = await getFromMarvel("public/characters", `limit=1&offset=${randomOffset}`);
            const hero = response.data.results[0];

            if (hero) {
                selectedHeroes.add({
                    idMarvel: hero.id.toString(),
                    name: hero.name,
                    image: `${hero.thumbnail.path}.${hero.thumbnail.extension}`
                });
            }
        }

        await Figurine.insertMany(Array.from(selectedHeroes));
        //console.log("100 figurine salvate con successo in MongoDB.");
    } catch (error) {
        console.error("Errore nel popolamento delle figurine:", error);
    }
}


exports.getHeroDetails = async (req, res) => {
    try {
        const heroId = req.params.id;
        //console.log(`Recupero dettagli per eroe ID: ${heroId}`);

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
