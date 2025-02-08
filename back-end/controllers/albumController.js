const Album = require('../models/album');


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
        console.log("User ID ricevuto dalla richiesta:", userId); // Debug

        const album = await Album.findOne({ userId });
        //const album = await Album.findOne({ userId: new mongoose.Types.ObjectId(userId) });
        console.log("userId:", userId);

        console.log("Album:", album);

        if (!album) {
            return res.status(404).json({ message: "Album non trovato" });
        }

        res.json(album);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero dell'album", error });
    }
};

