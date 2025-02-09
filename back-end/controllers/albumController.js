const Album = require('../models/album');
const User = require('../models/user');
const { getFromMarvel } = require("../marvel");
const { getRandomInt } = require("../marvel");


exports.createAlbum = async (req, res) => {
    try {
        const userId = req.user.userId;
        let album = await Album.findOne({ userId });

        if (album) {
            return res.status(400).json({ message: "Album già esistente" });
        }

        album = new Album({ userId, figurine: [] });
        await album.save();

        res.status(201).json(album);
    } catch (error) {
        res.status(500).json({ message: "Errore nella creazione dell'album", error });
    }
};

exports.getAlbum = async (req, res) => {
    try {
        const userId = req.user.userId;

        const album = await Album.findOne({ userId });

        if (!album) {
            return res.status(404).json({ message: "Album non trovato" });
        }

        res.json(album);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero dell'album", error });
    }
};


exports.buyPack = async (req, res) => {
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
        /*if (!response || !response.data || !response.data.results) {
            console.error("❌ Errore: la risposta Marvel non contiene dati validi.");
            return res.status(500).json({ message: "Errore nel recupero delle figurine da Marvel" });
        }*/

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
};


