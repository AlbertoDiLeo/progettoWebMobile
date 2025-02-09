const FigurineCollection = require("../models/figurineCollection");
const { getFromMarvel } = require("../marvel");
const { getRandomInt } = require("../marvel");



/*exports.populateFigurineCollection = async () => {
    try {
        const count = await FigurineCollection.countDocuments();
        if (count > 0) {
            console.log("🔹 La collezione di figurine esiste già.");
            return;
        }

        console.log("🔹 Recupero figurine dalla Marvel...");
        const ALBUM_HERO_LIMIT = 100; // Imposta un limite per evitare troppe figurine
        const response = await getFromMarvel("public/characters", `limit=${ALBUM_HERO_LIMIT}&offset=0`);

        if (!response || !response.data || !response.data.results) {
            console.error("❌ Errore nel recupero delle figurine da Marvel");
            return;
        }

        const allPossibleFigurines = response.data.results.map(hero => ({
            idMarvel: hero.id.toString(),
            name: hero.name,
            description: hero.description || "Nessuna descrizione disponibile",
            image: `${hero.thumbnail.path}.${hero.thumbnail.extension}`,
            series: hero.series.items.map(s => s.name),
            events: hero.events.items.map(e => e.name),
            comics: hero.comics.items.map(c => c.name)
        }));

        await FigurineCollection.insertMany(allPossibleFigurines);
        console.log(`✅ ${allPossibleFigurines.length} figurine inserite nella collezione globale!`);
    } catch (error) {
        console.error("❌ Errore nel popolamento delle figurine:", error);
    }
};*/


exports.populateFigurineCollection = async () => {
    try {
        const count = await FigurineCollection.countDocuments();
        if (count > 0) {
            console.log("🔹 La collezione di figurine esiste già.");
            return;
        }

        console.log("🔹 Recupero il numero totale di supereroi dalla Marvel...");
        const totalResponse = await getFromMarvel("public/characters", "limit=1");
        
        if (!totalResponse || !totalResponse.data || !totalResponse.data.total) {
            console.error("❌ Errore nel recupero del numero totale di eroi.");
            return;
        }
        
        const TOTAL_HEROES = totalResponse.data.total;
        const ALBUM_HERO_LIMIT = 100;

        console.log(`🔹 La Marvel ha ${TOTAL_HEROES} eroi disponibili.`);
        
        // Generiamo 100 numeri casuali (offset casuali) per ottenere 100 eroi diversi
        let selectedHeroes = new Set();
        while (selectedHeroes.size < ALBUM_HERO_LIMIT) {
            const randomOffset = getRandomInt(0, TOTAL_HEROES - 1);
            selectedHeroes.add(randomOffset);
        }

        let allPossibleFigurines = [];

        // Richiediamo eroi usando gli offset casuali
        for (let offset of selectedHeroes) {
            const response = await getFromMarvel("public/characters", `limit=1&offset=${offset}`);
            if (response && response.data && response.data.results.length > 0) {
                const hero = response.data.results[0];
                allPossibleFigurines.push({
                    idMarvel: hero.id.toString(),
                    name: hero.name,
                    description: hero.description || "Nessuna descrizione disponibile",
                    image: `${hero.thumbnail.path}.${hero.thumbnail.extension}`,
                    series: hero.series.items.map(s => s.name),
                    events: hero.events.items.map(e => e.name),
                    comics: hero.comics.items.map(c => c.name)
                });
            }
        }

        await FigurineCollection.insertMany(allPossibleFigurines);
        console.log(`✅ ${allPossibleFigurines.length} figurine casuali inserite nella collezione globale!`);
    } catch (error) {
        console.error("❌ Errore nel popolamento delle figurine:", error);
    }
};
