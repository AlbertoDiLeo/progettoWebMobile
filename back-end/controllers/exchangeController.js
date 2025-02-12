const Exchange = require('../models/exchange');
const User = require('../models/user');
const Figurina = require('../models/figurina');
const Album = require('../models/album');


exports.getExchanges = async (req, res) => {
    try {
        const exchanges = await Exchange.find().populate('offeredFigurina requestedFigurina');
        res.json(exchanges);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero degli scambi' });
    }
};


exports.createExchange = async (req, res) => { 
    try {
        const { offeredFigurinaId, requestedFigurinaId } = req.body;

        // **Troviamo `ObjectId` in MongoDB usando `idMarvel`**
        const offeredFigurina = await Figurina.findOne({ idMarvel: offeredFigurinaId });
        const requestedFigurina = await Figurina.findOne({ idMarvel: requestedFigurinaId });

        if (!offeredFigurina || !requestedFigurina) {
            return res.status(404).json({ error: "Una delle figurine non esiste nel database" });
        }

        const userAlbum = await Album.findOne({ userId: req.user.userId });
        const userFigurina = userAlbum.figurine.find(f => f.idMarvel === offeredFigurinaId);

        if (!userFigurina || userFigurina.count <= 1) {
            return res.status(400).json({ error: "Non puoi offrire questa figurina perché non è un doppione" });
        }

        await Album.updateOne(
            { userId: req.user.userId, "figurine.idMarvel": offeredFigurinaId },
            { $inc: { "figurine.$.count": -1 } }
        );


        // Creiamo il nuovo scambio
        const newExchange = new Exchange({
            offeredBy: req.user.userId, 
            offeredFigurina: offeredFigurina._id,  
            requestedFigurina: requestedFigurina._id,  
            status: 'pending'
        });

        // Salviamo lo scambio nel database
        await newExchange.save();

        res.status(201).json({ message: 'Scambio proposto con successo', exchange: newExchange });
    } catch (error) {
        console.error('Errore nella creazione dello scambio:', error);
        res.status(500).json({ error: 'Errore nel proporre lo scambio' });
    }
};


exports.withdrawExchange = async (req, res) => {
    try {
        const exchangeId = req.params.id;
        //console.log('exchangeId:', exchangeId);

        // Troviamo lo scambio
        const exchange = await Exchange.findById(exchangeId);
        if (!exchange) return res.status(404).json({ error: "Scambio non trovato" });

        // **Troviamo l'album dell'utente**
        const userAlbum = await Album.findOne({ userId: req.user.userId });
        if (!userAlbum) {
            return res.status(404).json({ error: "Album non trovato" });
        }
        //console.log('userAlbum:', userAlbum);

        const offeredFigurina = await Figurina.findById(exchange.offeredFigurina);
        //console.log('offeredFigurina:', offeredFigurina);

        await Album.updateOne(
            { userId: req.user.userId, "figurine.idMarvel": offeredFigurina.idMarvel },
            { $inc: { "figurine.$.count": +1 } }
        );
        //console.log('count:', userAlbum.figurine.find(f => f.idMarvel === offeredFigurina).count);

        // **Incrementiamo il conteggio della figurina direttamente nell'array con `$inc`**
        /*const updateResult = await Album.updateOne(
            { userId: req.user.userId, "figurine.idMarvel": exchange.offeredFigurina.idMarvel },
            { $inc: { "figurine.$.count": 1 } }
        );*/

        // Se la figurina non esiste, la aggiungiamo all'album con count = 1
        /*if (updateResult.modifiedCount === 0) {
            await Album.updateOne(
                { userId: req.user.userId },
                { $push: { figurine: { idMarvel: exchange.offeredFigurina.idMarvel, count: 1 } } }
            );
        }*/


        // Eliminare lo scambio dal database
        await Exchange.findByIdAndDelete(exchangeId);

        res.json({ message: "Scambio ritirato con successo" });
    } catch (error) {
        console.error("Errore nel ritiro dello scambio:", error);
        res.status(500).json({ error: "Errore nel ritiro dello scambio" });
    }
};



/*exports.acceptExchange = async (req, res) => {
    try {
        const exchangeId = req.params.id;
        const userId = req.user.userId; // Utente che sta accettando lo scambio

        // Trova lo scambio richiesto
        const exchange = await Exchange.findById(exchangeId);
        if (!exchange) {
            return res.status(404).json({ error: 'Scambio non trovato' });
        }

        // Controlliamo che l'utente abbia la figurina richiesta dallo scambio
        const user = await User.findById(userId);
        if (!user.album.includes(exchange.requestedFigurina)) {
            return res.status(400).json({ error: 'Non possiedi la figurina richiesta per completare lo scambio' });
        }

        // Troviamo l'utente che ha creato lo scambio
        const offeredUser = await User.findById(exchange.offeredBy);
        if (!offeredUser) {
            return res.status(404).json({ error: 'Utente che ha creato lo scambio non trovato' });
        }

        // Scambiamo le figurine tra gli utenti
        offeredUser.album = offeredUser.album.filter(figurina => figurina.toString() !== exchange.offeredFigurina.toString());
        offeredUser.album.push(exchange.requestedFigurina);

        user.album = user.album.filter(figurina => figurina.toString() !== exchange.requestedFigurina.toString());
        user.album.push(exchange.offeredFigurina);

        // Salviamo gli utenti aggiornati nel database
        await offeredUser.save();
        await user.save();

        // Aggiorniamo lo scambio come accettato
        exchange.status = 'accepted';
        await exchange.save();

        res.json({ message: 'Scambio accettato con successo', exchange });
    } catch (error) {
        console.error('Errore nell’accettare lo scambio:', error);
        res.status(500).json({ error: 'Errore durante l’accettazione dello scambio' });
    }
};*/


//offeredUser
//accepterUser


exports.acceptExchange = async (req, res) => {
    try {
        const exchangeId = req.params.id;
        const accepterId = req.user.userId; // L'utente che sta accettando lo scambio
        //console.log('accepterId:', accepterId);

        // **Troviamo lo scambio richiesto**
        const exchange = await Exchange.findById(exchangeId);
        if (!exchange) {
            return res.status(404).json({ error: "Scambio non trovato" });
        }

        const offeredUser = await User.findOne(exchange.offeredBy); // Utente che ha creato lo scambio
        const offeredId = offeredUser._id.toString();
        //console.log('offeredId:', offeredUser._id.toString());

        // **Controlliamo che offeredUser NON sia lo stesso che ha creato lo scambio**
        if (offeredId === accepterId) {
            return res.status(403).json({ error: "Non puoi accettare uno scambio che hai creato tu stesso" });
        }

        // **Troviamo i dati degli utenti**
        const offeredAlbum = await Album.findOne({ userId: offeredId });
        const accepterAlbum = await Album.findOne({ userId: accepterId });

        if (!offeredAlbum || !accepterAlbum) {
            return res.status(404).json({ error: "Album non trovato per uno degli utenti" });
        }

        const requestedFigurina = await Figurina.findById(exchange.requestedFigurina);

        // **Controlliamo se accepterUser possiede la figurina richiesta da offeredUser**
        const accepterHasRequestedFigurina = accepterAlbum.figurine.some(f => f.idMarvel === requestedFigurina.idMarvel && f.count > 1);
        if (!accepterHasRequestedFigurina) {
            return res.status(400).json({ error: "Non puoi accettare lo scambio perché non possiedi la figurina richiesta" });
        }

        const offeredFigurina = await Figurina.findById(exchange.offeredFigurina);

        // **Controlliamo se accepterUser ha già la figurina offerta come doppione**
        const accepterFigurinaOfferta = accepterAlbum.figurine.find(f => f.idMarvel === offeredFigurina.idMarvel);
        if (accepterFigurinaOfferta && accepterFigurinaOfferta.count > 0) {
            return res.status(400).json({ error: "Non puoi accettare lo scambio perché già possiedi la figurina offerta" });
        }

        // **Eseguiamo lo scambio**
        // 1️⃣ Rimuoviamo la figurina richiesta da accepterUser
        await Album.updateOne(
            { userId: accepterId, "figurine.idMarvel": exchange.requestedFigurina.idMarvel },
            { $inc: { "figurine.$.count": -1 } }
        );

        // 2️⃣ Aggiungiamo la figurina offerta a accepterUser
        await Album.updateOne(
            { userId: accepterId },
            { $push: { figurine: { idMarvel: exchange.offeredFigurina.idMarvel, count: 1 } } }
        );

        // 3️⃣ Rimuoviamo la figurina offerta da offeredUser
        await Album.updateOne(
            { userId: offeredId, "figurine.idMarvel": exchange.offeredFigurina.idMarvel },
            { $inc: { "figurine.$.count": -1 } }
        );

        // 4️⃣ Aggiungiamo la figurina richiesta a offeredUser
        await Album.updateOne(
            { userId: offeredId },
            { $push: { figurine: { idMarvel: requestedFigurina.idMarvel, count: 1 } } }
        );
        
        console.log("🟢 Stato attuale dello scambio prima:", exchange.status);
        // **Aggiorniamo lo stato dello scambio**
        exchange.status = "accepted";
        await exchange.save();
        console.log("🟢 Stato dello scambio dopo il salvataggio:", exchange.status);

        res.json({ message: "Scambio accettato con successo", exchange });
    } catch (error) {
        console.error("Errore nell’accettare lo scambio:", error);
        res.status(500).json({ error: "Errore durante l’accettazione dello scambio" });
    }
};


exports.rejectExchange = async (req, res) => {
    try {
        const exchangeId = req.params.id;
        const userId = req.user.userId; // L'utente che sta rifiutando lo scambio

        // **Troviamo lo scambio richiesto**
        const exchange = await Exchange.findById(exchangeId);
        if (!exchange) {
            return res.status(404).json({ error: "Scambio non trovato" });
        }

        // **Controlliamo che l'utente stia rifiutando uno scambio valido**
        if (exchange.offeredBy.toString() === userId.toString()) {
            return res.status(403).json({ error: "Non puoi rifiutare il tuo stesso scambio" });
        }

        // **Aggiorniamo lo stato dello scambio**
        exchange.status = "rejected";
        await exchange.save();

        res.json({ message: "Scambio rifiutato con successo", exchange });
    } catch (error) {
        console.error("Errore nel rifiutare lo scambio:", error);
        res.status(500).json({ error: "Errore durante il rifiuto dello scambio" });
    }
};






