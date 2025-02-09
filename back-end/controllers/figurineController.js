const FigurineCollection = require("../models/figurineCollection");
const { getFromMarvel } = require("../marvel");

/*exports.populateFigurineCollection = async () => {
    try {
        const count = await FigurineCollection.countDocuments();
        if (count > 0) {
            console.log("🔹 La collezione di figurine esiste già.");
            return;
        }

        console.log("🔹 Recupero figurine dalla Marvel...");
        const ALBUM_HERO_LIMIT = 100;
        const response = await getFromMarvel("public/characters", `limit=${ALBUM_HERO_LIMIT}&offset=0`);

        if (!response || !response.data || !response.data.results) {
            console.error("Errore nel recupero delle figurine da Marvel");
            return;
        }

        const allPossibleFigurines = response.data.results.map(hero => ({
            idMarvel: hero.id.toString(),
            name: hero.name,
            image: `${hero.thumbnail.path}.${hero.thumbnail.extension}`
        }));

        await FigurineCollection.insertMany(allPossibleFigurines);
        console.log("Figurine inserite nella collezione globale!");
    } catch (error) {
        console.error(" Errore nel popolamento delle figurine:", error);
    }
};*/

exports.populateFigurineCollection = async () => {
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
};
