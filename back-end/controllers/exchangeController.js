const Exchange = require("../models/exchange");
const Album = require("../models/album");
const User = require("../models/user");


exports.getExchanges = async (req, res) => {
    try {
        const exchanges = await Exchange.find()
        .populate("offeredBy")
        .populate("offeredFigurineIds")
        .populate("requestedFigurineIds");
        //console.log("📢 Scambi inviati al frontend:", exchanges); // DEBUG
        res.json(exchanges);
    } catch (error) {
        console.error("Errore nel recupero degli scambi:", error);
        res.status(500).json({ error: "Errore nel recupero degli scambi." });
    }
};


exports.createExchange = async (req, res) => {
    try {
        const { offeredFigurineIds, requestedFigurineIds, creditAmount, type } = req.body;
        const userId = req.user.userId;

        if (!offeredFigurineIds.length || (type !== "crediti" && !requestedFigurineIds.length)) {
            return res.status(400).json({ error: "Seleziona almeno una figurina da offrire e una da richiedere." });
        }

        const userAlbum = await Album.findOne({ userId });

        if (!userAlbum) {
            return res.status(404).json({ error: "Album non trovato." });
        }

        if (type === "doppioni") {
            // **Controllo che l'utente possa ricevere solo figurine nuove**
            for (const figurinaId of requestedFigurineIds) {
                const alreadyOwned = userAlbum.figurine.some(f => f.idMarvel === figurinaId);
                if (alreadyOwned) {
                    return res.status(400).json({ error: "Non puoi ricevere una figurina che possiedi già in uno scambio di doppioni." });
                }
            }
        }

        if (type === "multiplo") {
            // **Controllo che tutte le figurine offerte e richieste siano diverse**
            const allFigurine = [...offeredFigurineIds, ...requestedFigurineIds];
            if (new Set(allFigurine).size !== allFigurine.length) {
                return res.status(400).json({ error: "Le figurine offerte e richieste devono essere tutte diverse tra loro." });
            }
        }

        // **Aggiorniamo l'album rimuovendo le figurine offerte**
        for (const figurinaId of offeredFigurineIds) {
            const index = userAlbum.figurine.findIndex(f => f.idMarvel === figurinaId);
            if (index === -1 || userAlbum.figurine[index].count <= 1) {
                return res.status(400).json({ error: "Non puoi offrire questa figurina perché non è un doppione." });
            }
            userAlbum.figurine[index].count -= 1;
        }

        await userAlbum.save();

        // **Creiamo lo scambio**
        const newExchange = new Exchange({
            offeredBy: userId,
            offeredFigurineIds,
            requestedFigurineIds,
            creditAmount: type === "crediti" ? creditAmount : 0,
            type
        });

        await newExchange.save();
        res.status(201).json({ message: "Scambio proposto con successo", exchange: newExchange });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Errore nel proporre lo scambio." });
    }
};




exports.acceptExchange = async (req, res) => {
    try {
        const exchangeId = req.params.id;
        const accepterId = req.user.userId;

        const exchange = await Exchange.findById(exchangeId);
        if (!exchange || exchange.status !== "pending") {
            return res.status(400).json({ error: "Scambio non disponibile." });
        }

        const accepterAlbum = await Album.findOne({ userId: accepterId });
        const offeredAlbum = await Album.findOne({ userId: exchange.offeredBy });

        if (!accepterAlbum || !offeredAlbum) {
            return res.status(404).json({ error: "Album non trovato." });
        }

        if (exchange.type === "doppioni") {
            for (const figurinaId of exchange.requestedFigurineIds) {
                if (accepterAlbum.figurine.some(f => f.idMarvel === figurinaId)) {
                    return res.status(400).json({ error: "Non puoi accettare questo scambio perché possiedi già la figurina offerta." });
                }
            }
        }

        if (exchange.type !== "crediti") {
            for (const figurinaId of exchange.requestedFigurineIds) {
                const figurina = accepterAlbum.figurine.find(f => f.idMarvel === figurinaId);
                if (!figurina || figurina.count < 1) {
                    return res.status(400).json({ error: "Non possiedi la figurina richiesta." });
                }
                figurina.count -= 1;
            }
            await accepterAlbum.save();
        }

        if (exchange.type === "crediti") {
            const accepterUser = await User.findById(accepterId);
            accepterUser.credits -= exchange.creditAmount;
            await accepterUser.save();
        }

        for (const figurinaId of exchange.offeredFigurineIds) {
            const existingFigurina = accepterAlbum.figurine.find(f => f.idMarvel === figurinaId);
            if (existingFigurina) {
                existingFigurina.count += 1;
            } else {
                accepterAlbum.figurine.push({ idMarvel: figurinaId, count: 1 });
            }
        }

        await accepterAlbum.save();
        exchange.status = "accepted";
        await exchange.save();

        res.json({ message: "Scambio accettato con successo", exchange });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Errore nell’accettazione dello scambio." });
    }
};


exports.rejectExchange = async (req, res) => {
    try {
        const exchangeId = req.params.id;
        const userId = req.user.userId;

        const exchange = await Exchange.findById(exchangeId);
        if (!exchange || exchange.status !== "pending") {
            return res.status(400).json({ error: "Scambio non disponibile." });
        }

        // L'utente che rifiuta non deve essere lo stesso che ha proposto lo scambio
        if (exchange.offeredBy.toString() === userId) {
            return res.status(403).json({ error: "Non puoi rifiutare un tuo stesso scambio." });
        }

        const offeredUserAlbum = await Album.findOne({ userId: exchange.offeredBy });
        if (!offeredUserAlbum) {
            return res.status(404).json({ error: "Album non trovato." });
        }

        // **Restituiamo le figurine offerte a chi aveva proposto lo scambio**
        for (const figurinaId of exchange.offeredFigurineIds) {
            const figurina = offeredUserAlbum.figurine.find(f => f.idMarvel === figurinaId);
            if (figurina) {
                figurina.count += 1;
            } else {
                offeredUserAlbum.figurine.push({ idMarvel: figurinaId, count: 1 });
            }
        }

        await offeredUserAlbum.save();

        // **Se era uno scambio in crediti, restituiamo i crediti**
        if (exchange.type === "crediti") {
            const offeredUser = await User.findById(exchange.offeredBy);
            offeredUser.credits += exchange.creditAmount;
            await offeredUser.save();
        }

        // **Aggiorniamo lo stato dello scambio**
        exchange.status = "rejected";
        await exchange.save();

        res.json({ message: "Scambio rifiutato con successo.", exchange });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Errore nel rifiutare lo scambio." });
    }
};



exports.withdrawExchange = async (req, res) => {
    try {
        const exchangeId = req.params.id;
        const userId = req.user.userId;

        const exchange = await Exchange.findById(exchangeId);
        if (!exchange || exchange.status !== "pending") {
            return res.status(400).json({ error: "Non puoi ritirare questo scambio." });
        }

        // **Solo chi ha creato lo scambio può ritirarlo**
        if (exchange.offeredBy.toString() !== userId) {
            return res.status(403).json({ error: "Non puoi ritirare uno scambio che non hai creato." });
        }

        const userAlbum = await Album.findOne({ userId });
        if (!userAlbum) {
            return res.status(404).json({ error: "Album non trovato." });
        }

        // **Restituiamo le figurine offerte**
        for (const figurinaId of exchange.offeredFigurineIds) {
            const figurina = userAlbum.figurine.find(f => f.idMarvel === figurinaId);
            if (figurina) {
                figurina.count += 1;
            } else {
                userAlbum.figurine.push({ idMarvel: figurinaId, count: 1 });
            }
        }

        await userAlbum.save();

        // **Se lo scambio era in crediti, restituiamo i crediti**
        if (exchange.type === "crediti") {
            const user = await User.findById(userId);
            user.credits += exchange.creditAmount;
            await user.save();
        }

        // **cancelliamo lo scambio**
        await Exchange.findByIdAndDelete(exchangeId);

        res.json({ message: "Scambio ritirato con successo." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Errore nel ritiro dello scambio." });
    }
};