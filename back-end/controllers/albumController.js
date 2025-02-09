const Album = require('../models/album');
const User = require('../models/user');
const { getFromMarvel } = require("../marvel");
const { getRandomInt } = require("../marvel");
const FigurineCollection = require("../models/figurineCollection");



/*exports.createAlbum = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Controlla se l'utente ha già un album
        let existingAlbum = await Album.findOne({ userId });
        if (existingAlbum) {
            return res.status(400).json({ message: "Album già esistente" });
        }

        // 🔹 Recuperiamo una lista di figurine disponibili per questo album
        const ALBUM_HERO_LIMIT = 100;
        const response = await getFromMarvel("public/characters", `limit=${ALBUM_HERO_LIMIT}&offset=0`);

        console.log("🔹 Risposta API Marvel per figurine disponibili:", response);

        let allPossibleFigurines = [];
        if (response && response.data && response.data.results) {
            allPossibleFigurines = response.data.results.map(hero => ({
                idMarvel: hero.id.toString(),
                name: hero.name,
                image: `${hero.thumbnail.path}.${hero.thumbnail.extension}`
            }));
        }

        console.log("🔹 Figurine disponibili per l'album:", allPossibleFigurines.length, allPossibleFigurines);

        // 🔹 Creiamo un album con tutte le figurine possibili
        const newAlbum = new Album({
            userId,
            figurine: [],  // Nessuna figurina posseduta all'inizio
            allPossibleFigurines
        });

        await newAlbum.save();
        res.status(201).json({ message: "Album creato con successo", album: newAlbum });

    } catch (error) {
        console.error("❌ Errore nella creazione dell'album:", error);
        res.status(500).json({ message: "Errore nella creazione dell'album", error });
    }
};*/

exports.createAlbum = async (req, res) => {
    try {
        const userId = req.user.userId;

        let existingAlbum = await Album.findOne({ userId });
        if (existingAlbum) {
            return res.status(400).json({ message: "Album già esistente" });
        }

        // 🔹 Creiamo un album vuoto solo con le figurine trovate
        const newAlbum = new Album({
            userId,
            figurine: []
        });

        await newAlbum.save();
        res.status(201).json({ message: "Album creato con successo", album: newAlbum });

    } catch (error) {
        console.error("Errore nella creazione dell'album:", error);
        res.status(500).json({ message: "Errore nella creazione dell'album", error });
    }
};




/*exports.getAlbum = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log("🔹 Recupero album per userId:", userId);

        const album = await Album.findOne({ userId });
        if (!album) {
            return res.status(404).json({ message: "Album non trovato" });
        }

        // 🔹 Recuperiamo tutte le figurine disponibili
        const allPossibleFigurines = await FigurineCollection.find({});
        console.log("✅ Figurine totali disponibili:", allPossibleFigurines.length);

        // 🔹 Creiamo una mappa per sapere quali figurine l'utente possiede
        const figurinePossedute = new Set(album.figurine.map(f => f.idMarvel));
        const figurineCounts = album.figurine.reduce((acc, f) => {
            acc[f.idMarvel] = f.count;
            return acc;
        }, {});

        // 🔹 Formattiamo i dati per il frontend
        const albumData = allPossibleFigurines.map(hero => ({
            idMarvel: hero.idMarvel,
            name: hero.name,
            image: hero.image,
            //description: hero.description,
            //series: hero.series,
            //events: hero.events,
            //comics: hero.comics,
            found: figurinePossedute.has(hero.idMarvel),
            count: figurineCounts[hero.idMarvel] || 0
        }));

        res.json({ figurine: albumData });

    } catch (error) {
        console.error("❌ ERRORE GRAVE NEL RECUPERO DELL'ALBUM:", error);
        res.status(500).json({ message: "Errore nel recupero dell'album", error });
    }
};*/


exports.getAlbum = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log("🔹 Recupero album per userId:", userId);

        const album = await Album.findOne({ userId });
        if (!album) {
            return res.status(404).json({ message: "Album non trovato" });
        }

        // 🔹 Recuperiamo tutte le figurine disponibili
        const allPossibleFigurines = await FigurineCollection.find({});
        console.log("✅ Figurine totali disponibili:", allPossibleFigurines.length);

        if (allPossibleFigurines.length === 0) {
            return res.status(500).json({ message: "Errore: nessuna figurina disponibile nella collezione globale" });
        }

        // 🔹 Creiamo una mappa per sapere quali figurine l'utente possiede
        const figurinePossedute = new Set(album.figurine.map(f => f.idMarvel));
        const figurineCounts = album.figurine.reduce((acc, f) => {
            acc[f.idMarvel] = f.count;
            return acc;
        }, {});

        // 🔹 Formattiamo i dati per il frontend
        const albumData = allPossibleFigurines.map(hero => ({
            idMarvel: hero.idMarvel,
            name: hero.name,
            image: hero.image,
            description: hero.description,
            series: hero.series,
            events: hero.events,
            comics: hero.comics,
            found: figurinePossedute.has(hero.idMarvel),
            count: figurineCounts[hero.idMarvel] || 0
        }));

        res.json({ figurine: albumData });

    } catch (error) {
        console.error("❌ ERRORE GRAVE NEL RECUPERO DELL'ALBUM:", error);
        res.status(500).json({ message: "Errore nel recupero dell'album", error });
    }
};








/*exports.buyPack = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Controlliamo se l'utente ha abbastanza crediti
        const user = await User.findById(userId);
        if (!user || user.credits < 1) {
            return res.status(400).json({ message: "Crediti insufficienti" });
        }

        // Scalare un credito
        user.credits -= 1;
        await user.save();

        // 🔹 Definiamo il limite massimo di supereroi nel nostro album
        const ALBUM_HERO_LIMIT = 100;  // Impostiamo un limite di 100 supereroi totali
        const offset = getRandomInt(0, 1500 - ALBUM_HERO_LIMIT);  // Scegliamo casualmente da dove partire
        //const offset = getRandomInt(0, 1000); // Riduciamo l'offset per sicurezza

        // Recuperiamo i supereroi limitati usando l'offset casuale
        const response = await getFromMarvel("public/characters", `limit=${ALBUM_HERO_LIMIT}&offset=${offset}`);
        const allHeroes = response.data.results;

        // prova
       // const response = await getFromMarvel("public/characters", `limit=${ALBUM_HERO_LIMIT}&offset=${offset}`);
        console.log("🔹 Risposta ricevuta da Marvel API:", response);  // Debug

        // Controlliamo se la risposta contiene i dati corretti
        //if (!response || !response.data || !response.data.results) {
            //console.error("❌ Errore: la risposta Marvel non contiene dati validi.");
            //return res.status(500).json({ message: "Errore nel recupero delle figurine da Marvel" });
        //}

        //const allHeroes = response.data.results;

        const newFigurine = [];

        // Generiamo 5 figurine casuali dal nostro set limitato
        for (let i = 0; i < 5; i++) {
            const randomHero = allHeroes[getRandomInt(0, allHeroes.length - 1)];
            newFigurine.push({
                idMarvel: randomHero.id,
                name: randomHero.name,
                image: `${randomHero.thumbnail.path}.${randomHero.thumbnail.extension}`
            });
        }

        console.log("✅ Figurine trovate:", newFigurine);

        // Ritorniamo le figurine trovate, ma non le salviamo ancora nell'album
        res.json({ newFigurine });

    } catch (error) {
        console.error("Errore nell'acquisto del pacchetto:", error);
        res.status(500).json({ message: "Errore nell'acquisto del pacchetto", error });
    }
};*/




/*exports.buyPack = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(`🔹 Acquisto pacchetto per userId: ${userId}`);

        let album = await Album.findOne({ userId });
        if (!album) {
            console.log("❌ Album non trovato per questo utente.");
            return res.status(404).json({ message: "Album non trovato" });
        }

        // 🔹 Recuperiamo tutte le figurine disponibili
        const allPossibleFigurines = await FigurineCollection.find({});
        if (allPossibleFigurines.length === 0) {
            console.log("❌ Nessuna figurina disponibile per il pacchetto!");
            return res.status(500).json({ message: "Nessuna figurina disponibile per il pacchetto" });
        }
        console.log(`✅ Figurine totali disponibili per il pacchetto: ${allPossibleFigurines.length}`);

        // 🔹 Estraiamo 5 figurine casuali
        let figurineTrovate = [];
        for (let i = 0; i < 5; i++) {
            const randomIndex = getRandomInt(0, allPossibleFigurines.length - 1);
            figurineTrovate.push(allPossibleFigurines[randomIndex]);
        }

        console.log("📜 Figurine trovate prima di inviare al frontend:", figurineTrovate);

        // 🔹 Verifica che stiamo inviando un array valido
        res.json({ figurine: figurineTrovate });

    } catch (error) {
        console.error("❌ Errore nell'acquisto del pacchetto:", error);
        res.status(500).json({ message: "Errore nell'acquisto del pacchetto", error });
    }
};*/


exports.buyPack = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(`🔹 Acquisto pacchetto per userId: ${userId}`);

        // Troviamo le figurine disponibili nel database
        const allPossibleFigurines = await FigurineCollection.find({});
        if (allPossibleFigurines.length === 0) {
            console.log("❌ Nessuna figurina disponibile per il pacchetto!");
            return res.status(500).json({ message: "Nessuna figurina disponibile" });
        }

        // 🔹 Estrazione casuale di 5 figurine
        let figurineTrovate = [];
        for (let i = 0; i < 5; i++) {
            const randomIndex = getRandomInt(0, allPossibleFigurines.length - 1);
            figurineTrovate.push(allPossibleFigurines[randomIndex]);
        }

        console.log("📜 Figurine trovate prima di inviare al frontend:", figurineTrovate);

        // 🔹 Invio delle figurine trovate al frontend, **ma non vengono ancora salvate nell'album**
        res.json({ figurine: figurineTrovate });

    } catch (error) {
        console.error("❌ Errore nell'acquisto del pacchetto:", error);
        res.status(500).json({ message: "Errore nell'acquisto del pacchetto", error });
    }
};






exports.addToAlbum = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { figurine } = req.body;  // Riceviamo le figurine trovate

        console.log("🔹 Aggiunta figurine all'album per userId:", userId, "Figurine:", figurine);

        // Troviamo l'album dell'utente
        let album = await Album.findOne({ userId });

        if (!album) {
            return res.status(404).json({ message: "Album non trovato" });
        }

        // Controlliamo i doppioni e aggiorniamo l'album
        figurine.forEach(figurina => {
            const existingFigurina = album.figurine.find(f => f.idMarvel === figurina.idMarvel);
            if (existingFigurina) {
                existingFigurina.count += 1;  // 🔹 Se è un doppione, aumentiamo il conteggio
            } else {
                album.figurine.push({ ...figurina, count: 1 });  // 🔹 Se è nuova, la aggiungiamo con count=1
            }
        });

        await album.save();
        console.log("✅ Album aggiornato:", album);
        
        res.json({ message: "Figurine aggiunte all'album", album });

    } catch (error) {
        console.error("❌ Errore nell'aggiunta delle figurine:", error);
        res.status(500).json({ message: "Errore nell'aggiunta delle figurine all'album", error });
    }
};

