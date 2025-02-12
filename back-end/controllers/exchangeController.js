const Exchange = require('../models/Exchange');
const User = require('../models/User');
const Figurina = require('../models/Figurina');
const Album = require('../models/Album');


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

        // Contiamo quanti scambi attualmente coinvolgono questa figurina
        /*const existingExchanges = await Exchange.countDocuments({
            offeredBy: req.user.userId,
            offeredFigurina: offeredFigurina._id
        });

        if (existingExchanges >= userFigurina.count - 1) {
            return res.status(400).json({ error: "Hai già raggiunto il limite di scambi per questa figurina!" });
        }*/

        //console.log('count:', userFigurina.nome, userFigurina.count);

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

        // **Troviamo lo scambio richiesto**
        const exchange = await Exchange.findById(exchangeId);
        if (!exchange) {
            return res.status(404).json({ error: "Scambio non trovato" });
        }

        const offeredId = exchange.offeredBy; // Utente che ha creato lo scambio

        // **Controlliamo che offeredUser NON sia lo stesso che ha creato lo scambio**
        if (offeredId.toString() === accepterId.toString()) {
            return res.status(403).json({ error: "Non puoi accettare uno scambio che hai creato tu stesso" });
        }

        // **Troviamo i dati degli utenti**
        const offeredAlbum = await Album.findOne({ userId: offeredId });
        const accepterAlbum = await Album.findOne({ userId: accepterId });

        if (!offeredAlbum || !accepterAlbum) {
            return res.status(404).json({ error: "Album non trovato per uno degli utenti" });
        }

        // **Controlliamo se accepterUser possiede la figurina richiesta da offeredUser**
        const accepterHasRequestedFigurina = accepterAlbum.figurine.some(f => f.idMarvel === exchange.requestedFigurina.toString() && f.count > 0);
        if (!accepterHasRequestedFigurina) {
            return res.status(400).json({ error: "Non puoi accettare lo scambio perché non possiedi la figurina richiesta" });
        }

        // **Controlliamo se accepterUser ha già la figurina offerta come doppione**
        const accepterFigurinaOfferta = accepterAlbum.figurine.find(f => f.idMarvel === exchange.offeredFigurina.toString());
        if (accepterFigurinaOfferta && accepterFigurinaOfferta.count > 0) {
            return res.status(400).json({ error: "Non puoi accettare lo scambio perché già possiedi la figurina offerta" });
        }

        // **Eseguiamo lo scambio**
        // 1️⃣ Rimuoviamo la figurina richiesta da accepterUser
        await Album.updateOne(
            { userId: accepterId, "figurine.idMarvel": exchange.requestedFigurina.toString() },
            { $inc: { "figurine.$.count": -1 } }
        );

        // 2️⃣ Aggiungiamo la figurina offerta a accepterUser
        await Album.updateOne(
            { userId: accepterId },
            { $push: { figurine: { idMarvel: exchange.offeredFigurina.toString(), count: 1 } } }
        );

        // 3️⃣ Rimuoviamo la figurina offerta da offeredUser
        await Album.updateOne(
            { userId: userId1, "figurine.idMarvel": exchange.offeredFigurina.toString() },
            { $inc: { "figurine.$.count": -1 } }
        );

        // 4️⃣ Aggiungiamo la figurina richiesta a offeredUser
        await Album.updateOne(
            { userId: userId1 },
            { $push: { figurine: { idMarvel: exchange.requestedFigurina.toString(), count: 1 } } }
        );

        // **Aggiorniamo lo stato dello scambio**
        exchange.status = "accepted";
        await exchange.save();

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





exports.withdrawExchange = async (req, res) => {
    try {
        const exchangeId = req.params.id;
        //console.log('exchangeId:', exchangeId);

        // Troviamo lo scambio
        const exchange = await Exchange.findById(exchangeId);
        if (!exchange) return res.status(404).json({ error: "Scambio non trovato" });

        // Verifichiamo che lo scambio appartenga all'utente
        if (exchange.offeredBy.toString() !== req.user.userId) {
            return res.status(403).json({ error: "Non puoi ritirare uno scambio che non hai creato" });
        }

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
