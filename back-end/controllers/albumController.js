const Album = require('../models/album');
const User = require('../models/user');
const mongoose = require('mongoose');


exports.createAlbum = async (req, res) => {
    try {
        const userId = req.user.id;
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
        const userId = req.user.id;
        console.log("🔹 Acquisto pacchetto per userId:", userId);

        // Controlliamo se l'utente ha abbastanza crediti
        const user = await User.findById(userId);
        if (user.credits < 1) {
            return res.status(400).json({ message: "Crediti insufficienti" });
        }

        // Scalare un credito
        user.credits -= 1;
        await user.save();

        // Generare 5 figurine casuali
        const response = await getFromMarvel("public/characters", "limit=100");
        const allHeroes = response.data.results;
        const newFigurine = [];

        for (let i = 0; i < 5; i++) {
            const randomHero = allHeroes[Math.floor(Math.random() * allHeroes.length)];
            newFigurine.push({
                idMarvel: randomHero.id,
                name: randomHero.name,
                image: `${randomHero.thumbnail.path}.${randomHero.thumbnail.extension}`
            });
        }

        console.log("✅ Figurine trovate:", newFigurine);

        // Ritorniamo le figurine trovate, ma non le salviamo ancora
        res.json({ newFigurine });

    } catch (error) {
        console.error("❌ Errore nell'acquisto del pacchetto:", error);
        res.status(500).json({ message: "Errore nell'acquisto del pacchetto", error });
    }
};


