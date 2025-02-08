const Album = require('../models/album');

exports.createAlbum = async (req, res) => {
    try {
        const userId = req.user.id;  // Recupera l'ID dell'utente autenticato

        // Controlla se l'utente ha già un album
        let existingAlbum = await Album.findOne({ userId });
        if (existingAlbum) {
            return res.status(400).json({ message: "Album già esistente" });
        }

        // Crea un nuovo album vuoto
        const newAlbum = new Album({ userId, figurine: [] });
        await newAlbum.save();

        res.status(201).json({ message: "Album creato con successo", album: newAlbum });
    } catch (error) {
        res.status(500).json({ message: "Errore nella creazione dell'album", error });
    }
};

exports.getAlbum = async (req, res) => {
    try {
        const userId = req.user.id;
        const album = await Album.findOne({ userId });

        if (!album) {
            return res.status(404).json({ message: "Album non trovato" });
        }

        res.json(album);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero dell'album", error });
    }
};
