const Album = require('../models/album');
const User = require('../models/user');
const Figurina = require("../models/figurina");
const { getRandomInt } = require("../marvel");



exports.createAlbum = async (req, res) => {
    try {
        const userId = req.user.userId;

        let existingAlbum = await Album.findOne({ userId });
        if (existingAlbum) {
            return res.status(400).json({ message: "Album già esistente" });
        }

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



exports.getAlbum = async (req, res) => {
    try {
        const userId = req.user.userId;

        const album = await Album.findOne({ userId });
        if (!album) {
            return res.status(404).json({ message: "Album non trovato" });
        }

        // Recuperiamo tutte le figurine disponibili
        const allPossibleFigurines = await Figurina.find({});
        //console.log("Figurine totali disponibili:", allPossibleFigurines.length);

        if (allPossibleFigurines.length === 0) {
            return res.status(500).json({ message: "Errore: nessuna figurina disponibile nella collezione globale" });
        }

        // Creiamo una mappa per sapere quali figurine l'utente possiede
        const figurinePossedute = new Set(album.figurine.map(f => f.idMarvel));
        const figurineCounts = album.figurine.reduce((acc, f) => {
            acc[f.idMarvel] = f.count;
            return acc;
        }, {});
        //console.log("Figurine possedute dall'utente:", figurinePossedute);

        // Formattiamo i dati per il frontend
        const albumData = allPossibleFigurines.map(hero => ({
            idMarvel: hero.idMarvel,
            name: hero.name,
            image: hero.image,
            found: figurinePossedute.has(hero.idMarvel), 
            count: figurineCounts[hero.idMarvel] || 0
        }));

        res.json({ figurine: albumData });

    } catch (error) {
        console.error("ERRORE GRAVE NEL RECUPERO DELL'ALBUM:", error);
        res.status(500).json({ message: "Errore nel recupero dell'album", error });
    }
};


exports.buyPack = async (req, res) => {
    try {
        const userId = req.user.userId;
        //console.log(`Acquisto pacchetto per userId: ${userId}`);

        let album = await Album.findOne({ userId });
        if (!album) {
            //console.log("Album non trovato per questo utente.");
            return res.status(404).json({ message: "Album non trovato" });
        }

        const user = await User.findById(userId);
        if (!user) {
            //console.log("Utente non trovato.");
            return res.status(404).json({ message: "Utente non trovato" });
        }

        if (user.credits < 1) {
            //console.log("Crediti insufficienti per acquistare un pacchetto.");
            return res.status(400).json({ message: "Crediti insufficienti" });
        }

        user.credits -= 1;
        await user.save();

        // Troviamo le figurine disponibili nel database
        const allPossibleFigurines = await Figurina.find({});
        if (allPossibleFigurines.length === 0) {
            //console.log("Nessuna figurina disponibile per il pacchetto!");
            return res.status(500).json({ message: "Nessuna figurina disponibile" });
        }

        // Estrazione casuale di 5 figurine
        /*let figurineTrovate = [];
        for (let i = 0; i < 5; i++) {
            const randomIndex = getRandomInt(0, allPossibleFigurines.length - 1);
            figurineTrovate.push(allPossibleFigurines[randomIndex]);
        }*/
       
        let figurineTrovate = new Set();
        while (figurineTrovate.size < 5) {
            const randomIndex = getRandomInt(0, allPossibleFigurines.length - 1);
            figurineTrovate.add(allPossibleFigurines[randomIndex]);
        }
        figurineTrovate = Array.from(figurineTrovate); // Convertiamo il Set in Array
       

        

        //console.log("📜 Figurine trovate prima di inviare al frontend:", figurineTrovate);

        // Invio delle figurine trovate al frontend, **ma non vengono ancora salvate nell'album**
        res.json({ figurine: figurineTrovate, credits: user.credits });
        //console.log("✅ Crediti inviati al frontend:", user.credits);

    } catch (error) {
        console.error("Errore nell'acquisto del pacchetto:", error);
        res.status(500).json({ message: "Errore nell'acquisto del pacchetto", error });
    }
};






exports.addToAlbum = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { idMarvel, name, image } = req.body;
        //console.log("userId =", userId);
        //console.log("body", req.body);
        //console.log("Aggiunta di una figurina all'album:", idMarvel, name, image);

        if (!idMarvel || !name || !image) {
            return res.status(400).json({ message: "Dati mancanti" });
        }

        // Troviamo l'album dell'utente
        let album = await Album.findOne({ userId });
        //console.log("album", album);

        if (!album) {
            return res.status(404).json({ message: "Album non trovato" });
        }

        // Cerca se esiste già la figurina
        let existingFigurina = album.figurine.find(f => f.idMarvel === idMarvel);
        if (existingFigurina) {
            existingFigurina.count += 1; // Aumenta il contatore
        } else {
            album.figurine.push({ idMarvel, name, image, count: 1 });
        }


        await album.save();
        //console.log("Album aggiornato:", album);
        
        res.json({ message: "Figurine aggiunte all'album", album });

    } catch (error) {
        console.error("Errore nell'aggiunta delle figurine:", error);
        res.status(500).json({ message: "Errore nell'aggiunta delle figurine all'album", error });
    }
};

