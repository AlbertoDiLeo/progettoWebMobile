const Album = require('../models/album');

exports.getAlbum = async (req, res) => {
    try {
        const userId = req.user.id;
        let album = await Album.findOne({ userId });

        if (!album) {
            console.log("Album non trovato. Creazione in corso...");
            album = new Album({ userId, figurine: [] });
            console.log("Album creato:", album);
            await album.save();
        }

        res.json(album);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero dell'album", error });
    }
};

