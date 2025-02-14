/*const Exchange = require("../models/exchange");
const Album = require("../models/album");
const User = require("../models/user");
const Figurina = require("../models/figurina");


exports.getExchanges = async (req, res) => {
    try {
        const exchanges = await Exchange.find()
            .populate("offeredBy", "username")
            .populate("offeredFigurines", "idMarvel name image")
            .populate("requestedFigurines", "idMarvel name image");

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
            return res.status(400).json({ error: "Seleziona almeno una figurina da offrire e una da ricevere." });
        }

        // **Convertiamo gli idMarvel in ObjectId**
        const offeredFigurines = await Figurina.find({ idMarvel: { $in: offeredFigurineIds } });
        const requestedFigurines = await Figurina.find({ idMarvel: { $in: requestedFigurineIds } });

        if (offeredFigurines.length !== offeredFigurineIds.length || 
            (type !== "crediti" && requestedFigurines.length !== requestedFigurineIds.length)) {
            return res.status(400).json({ error: "Alcune figurine non esistono nel database." });
        }

        // **Rimuoviamo le figurine offerte dall'album**
        const userAlbum = await Album.findOne({ userId });
        for (const figurina of offeredFigurines) {
            const index = userAlbum.figurine.findIndex(f => f.idMarvel === figurina.idMarvel);
            if (index === -1 || userAlbum.figurine[index].count <= 1) {
                return res.status(400).json({ error: "Non puoi offrire questa figurina perché non è un doppione." });
            }
            userAlbum.figurine[index].count -= 1;
        }
        await userAlbum.save();

        // **Creiamo lo scambio**
        const newExchange = new Exchange({
            offeredBy: userId,
            offeredFigurines: offeredFigurines.map(f => f._id),
            requestedFigurines: type === "crediti" ? [] : requestedFigurines.map(f => f._id),
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





exports.acceptExchange = async (req, res) => { //da rivedere
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


exports.rejectExchange = async (req, res) => { //da rivedere
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



exports.withdrawExchange = async (req, res) => { //da rivedere
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
};*/



/*const Exchange = require('../models/exchange');
const Album = require('../models/album');
const User = require('../models/user');
const Figurina = require('../models/figurina');

// Recupera tutti gli scambi disponibili (solo quelli che l'utente può accettare)
exports.getExchanges = async (req, res) => {
    const userId = req.user.id;
    try {
        const userAlbum = await Album.findOne({ userId });
        const userFigurineIds = userAlbum.figurine.map(f => f.idMarvel);

        const exchanges = await Exchange.find()
            .populate('offeredFigurines')
            .populate('requestedFigurines');

        // Filtra solo scambi pertinenti all'utente
        const filteredExchanges = exchanges.filter(exchange => {
            if (exchange.offeredBy.toString() === userId) {
                return true; // Gli scambi proposti dall'utente
            }
            if (exchange.type === 'crediti') {
                return exchange.requestedFigurines.length === 0; 
            }
            // Per scambi di figurine, verifica se l'utente ha le figurine richieste
            return exchange.requestedFigurines.every(fig => userFigurineIds.includes(fig.idMarvel));
        });

        res.status(200).json(filteredExchanges);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore durante il recupero degli scambi" });
    }
};

// Crea un nuovo scambio
exports.createExchange = async (req, res) => {
    const { offeredBy, offeredFigurines, requestedFigurines, creditAmount, type } = req.body;

    try {
        // Validazione: massimo 3 figurine offerte/richieste
        if (offeredFigurines.length > 3 || requestedFigurines.length > 3) {
            return res.status(400).json({ message: "Puoi offrire o richiedere massimo 3 figurine" });
        }

        const newExchange = new Exchange({
            offeredBy,
            offeredFigurines,
            requestedFigurines,
            creditAmount,
            type,
            status: 'pending'
        });

        await newExchange.save();
        res.status(201).json({ message: "Scambio creato con successo", exchange: newExchange });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore durante la creazione dello scambio" });
    }
};

// Accetta uno scambio
exports.acceptExchange = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const exchange = await Exchange.findById(id)
            .populate('offeredFigurines')
            .populate('requestedFigurines');

        if (!exchange || exchange.status !== 'pending') {
            return res.status(404).json({ message: "Scambio non valido o già concluso" });
        }

        // Gestisce la transazione per doppioni, multiplo o crediti
        const userAlbum = await Album.findOne({ userId });
        const offeredUserAlbum = await Album.findOne({ userId: exchange.offeredBy });
        const user = await User.findById(userId);
        const offeredUser = await User.findById(exchange.offeredBy);

        // Controllo per gli scambi con crediti
        if (exchange.type === 'crediti') {
            if (user.credits < exchange.creditAmount) {
                return res.status(400).json({ message: "Crediti insufficienti" });
            }

            // Trasferimento crediti
            user.credits -= exchange.creditAmount;
            offeredUser.credits += exchange.creditAmount;

        } else {
            // Rimozione delle figurine offerte dal proponente
            exchange.offeredFigurines.forEach(fig => {
                const index = offeredUserAlbum.figurine.findIndex(f => f.idMarvel === fig.idMarvel);
                if (index !== -1) {
                    if (offeredUserAlbum.figurine[index].count > 1) {
                        offeredUserAlbum.figurine[index].count -= 1;
                    } else {
                        offeredUserAlbum.figurine.splice(index, 1);
                    }
                }
            });

            // Rimozione delle figurine richieste dall'accettante
            exchange.requestedFigurines.forEach(fig => {
                const index = userAlbum.figurine.findIndex(f => f.idMarvel === fig.idMarvel);
                if (index !== -1) {
                    if (userAlbum.figurine[index].count > 1) {
                        userAlbum.figurine[index].count -= 1;
                    } else {
                        userAlbum.figurine.splice(index, 1);
                    }
                }
            });

            // Aggiunta delle nuove figurine ricevute
            exchange.offeredFigurines.forEach(fig => {
                const existingFig = userAlbum.figurine.find(f => f.idMarvel === fig.idMarvel);
                if (existingFig) {
                    existingFig.count += 1;
                } else {
                    userAlbum.figurine.push({
                        idMarvel: fig.idMarvel,
                        name: fig.name,
                        image: fig.image,
                        count: 1
                    });
                }
            });

            exchange.requestedFigurines.forEach(fig => {
                const existingFig = offeredUserAlbum.figurine.find(f => f.idMarvel === fig.idMarvel);
                if (existingFig) {
                    existingFig.count += 1;
                } else {
                    offeredUserAlbum.figurine.push({
                        idMarvel: fig.idMarvel,
                        name: fig.name,
                        image: fig.image,
                        count: 1
                    });
                }
            });
        }

        exchange.status = 'accepted';
        await user.save();
        await offeredUser.save();
        await userAlbum.save();
        await offeredUserAlbum.save();
        await exchange.save();

        res.status(200).json({ message: "Scambio accettato con successo" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore durante l'accettazione dello scambio" });
    }
};

// Rifiuta uno scambio
exports.rejectExchange = async (req, res) => {
    const { id } = req.params;
    try {
        const exchange = await Exchange.findById(id);
        if (!exchange || exchange.status !== 'pending') {
            return res.status(404).json({ message: "Scambio non valido o già concluso" });
        }
        exchange.status = 'rejected';
        await exchange.save();
        res.status(200).json({ message: "Scambio rifiutato" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore durante il rifiuto dello scambio" });
    }
};

// Ritira uno scambio proposto
exports.withdrawExchange = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const exchange = await Exchange.findById(id);
        if (!exchange || exchange.offeredBy.toString() !== userId) {
            return res.status(403).json({ message: "Non sei autorizzato a ritirare questo scambio" });
        }

        await Exchange.findByIdAndDelete(id);
        res.status(200).json({ message: "Scambio ritirato con successo" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore durante il ritiro dello scambio" });
    }
};
*/


const Exchange = require('../models/exchange');
const User = require('../models/user');
const Figurina = require('../models/figurina');

// Funzione per creare uno scambio
exports.createExchange = async (req, res) => {
  try {
    const { offeredFigurines, requestedFigurines, creditAmount, type } = req.body;
    const userId = req.user.userId;

    // Validazioni base
    if (!type || !['doppioni', 'multiplo', 'crediti'].includes(type)) {
      return res.status(400).json({ message: 'Tipo di scambio non valido' });
    }
    if (type === 'crediti' && (!creditAmount || creditAmount <= 0)) {
      return res.status(400).json({ message: 'Importo crediti non valido' });
    }
    if (type !== 'crediti' && (!requestedFigurines || requestedFigurines.length === 0)) {
      return res.status(400).json({ message: 'Figurine richieste obbligatorie' });
    }

    // Creazione dello scambio
    const newExchange = new Exchange({
      offeredBy: userId,
      offeredFigurines,
      requestedFigurines: type !== 'crediti' ? requestedFigurines : [],
      creditAmount: type === 'crediti' ? creditAmount : 0,
      type,
    });

    await newExchange.save();
    res.status(201).json({ message: 'Scambio creato con successo', exchange: newExchange });
  } catch (error) {
    console.error('Errore nella creazione dello scambio:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
}

exports.getMyExchanges = async (req, res) => {
    try {
      const userId = req.user.userId;
      const exchanges = await Exchange.find({ offeredBy: userId }).populate('offeredFigurines requestedFigurines');
      console.log(exchanges);
      
      res.status(200).json(exchanges);
    } catch (error) {
      console.error('Errore nel recupero degli scambi proposti:', error);
      res.status(500).json({ message: 'Errore nel recupero degli scambi proposti' });
    }
}


exports.withdrawExchange = async (req, res) => {
    try {
      const userId = req.user.userId;
      const exchangeId = req.params.id;
  
      const exchange = await Exchange.findOne({ _id: exchangeId, offeredBy: userId });
      if (!exchange) {
        return res.status(404).json({ message: 'Scambio non trovato o non autorizzato' });
      }
  
      await Exchange.deleteOne({ _id: exchangeId });
      res.status(200).json({ message: 'Scambio ritirato con successo' });
    } catch (error) {
      console.error('Errore nel ritiro dello scambio:', error);
      res.status(500).json({ message: 'Errore nel ritiro dello scambio' });
    }
  }

