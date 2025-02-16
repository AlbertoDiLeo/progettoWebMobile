/*


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
*/


const Exchange = require('../models/exchange');
const User = require('../models/user');
const Figurina = require('../models/figurina');
const Album = require('../models/album');

exports.createExchange = async (req, res) => {
  try {
    const { offeredFigurines, requestedFigurines, creditAmount, type } = req.body;
    const userId = req.user.userId;

    const offered = offeredFigurines.map(fig => ({ idMarvel: fig.idMarvel, name: fig.name }));
    const requested = requestedFigurines?.map(fig => ({ idMarvel: fig.idMarvel, name: fig.name }));

    // Trova e aggiorna l'album
    const album = await Album.findOne({ userId });
    if (!album) return res.status(404).json({ message: 'Album non trovato' });
    for (const figurina of offeredFigurines) {
        const index = album.figurine.findIndex(f => f.idMarvel === figurina.idMarvel);
        if (index === -1 || album.figurine[index].count <= 1) {
            return res.status(400).json({ error: "Non puoi offrire questa figurina perché non è un doppione." });
        }
        album.figurine[index].count -= 1;
    }

    await album.save();  

    const newExchange = new Exchange({
      offeredBy: userId,
      offeredFigurines: offered,
      requestedFigurines: requested || [],
      creditAmount: type === 'crediti' ? creditAmount : 0,
      type,
    });

    await newExchange.save();
    res.status(201).json({ message: 'Scambio creato con successo', exchange: newExchange });

  } catch (error) {
    console.error('Errore nella creazione dello scambio:', error);
    res.status(500).json({ message: 'Errore interno del server', error });
  }
};


exports.getMyExchanges = async (req, res) => {
    try {
      const userId = req.user.userId;
      const exchanges = await Exchange.find({ offeredBy: userId, status: 'pending' }).populate('offeredFigurines requestedFigurines');
      //console.log(exchanges);
      
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
            return res.status(400).json({ error: "Non puoi ritirare questo scambio." });
        }

        // **Solo chi ha creato lo scambio può ritirarlo**
        if (exchange.offeredBy.toString() !== userId) {
            return res.status(403).json({ error: "Non puoi ritirare uno scambio che non hai creato." });
        }

        const album = await Album.findOne({ userId });
        if (!album) {
            return res.status(404).json({ message: 'Album non trovato' });
        }
  
        // Restituisce le figurine offerte all'album
        for (const figurina of exchange.offeredFigurines) {
            const index = album.figurine.findIndex(f => f.idMarvel === figurina.idMarvel);
            if (index > -1) {
                album.figurine[index].count += 1;  // Aumenta il contatore
            } 
        }
  
        //await album.save();
        await album.save().catch(err => console.error('Errore nel salvataggio:', err));
        await Exchange.deleteOne({ _id: exchangeId });
  
        res.status(200).json({ message: 'Scambio ritirato con successo' });
    } catch (error) {
        console.error('Errore nel ritiro dello scambio:', error);
        res.status(500).json({ message: 'Errore nel ritiro dello scambio' });
    }
};


// scambi doppioni
exports.getAvailableExchanges = async (req, res) => {
    try {
      const userId = req.user.userId;
      const userAlbum = await Album.findOne({ userId });
      if (!userAlbum) return res.status(404).json({ message: 'Album non trovato' });
  
      const allExchanges = await Exchange.find({ status: 'pending', offeredBy: { $ne: userId } }).populate('offeredBy', 'name');
  
      const availableExchanges = allExchanges.filter(exchange => {
        if (exchange.type !== 'doppioni') return false;
  
        const userFigurines = userAlbum.figurine;
  
        const hasDoppione = exchange.requestedFigurines.every(reqFig => {
          const fig = userFigurines.find(f => f.idMarvel === reqFig.idMarvel);
          return fig && fig.count > 1; // Deve essere un doppione
        });
  
        const isNewFigurina = exchange.offeredFigurines.every(offFig => {
          const fig = userFigurines.find(f => f.idMarvel === offFig.idMarvel);
          return !fig || fig.count === 0; // Deve essere nuova
        });
  
        return hasDoppione && isNewFigurina;
      });

        console.log('Scambi trovati per scambio doppione:', allExchanges.length);
        console.log('Scambi filtrati:', availableExchanges.length);
  
      res.status(200).json({ exchanges: availableExchanges });
    } catch (error) {
      console.error('Errore nel recupero degli scambi disponibili:', error);
      res.status(500).json({ message: 'Errore nel recupero degli scambi disponibili' });
    }
};



exports.getMultiploExchanges = async (req, res) => {
    try {
      const userId = req.user.userId;
      const userAlbum = await Album.findOne({ userId });
      if (!userAlbum) return res.status(404).json({ message: 'Album non trovato' });
  
      const allExchanges = await Exchange.find({ status: 'pending', type: 'multiplo', offeredBy: { $ne: userId } }).populate('offeredBy', 'name');
  
      const availableExchanges = allExchanges.filter(exchange => {
        const userFigurines = userAlbum.figurine;
  
        // Controlla se tutte le figurine richieste sono doppioni per l'utente
        const allDoppioni = exchange.requestedFigurines.every(reqFig => {
          const fig = userFigurines.find(f => f.idMarvel === reqFig.idMarvel);
          return fig && fig.count > 1; // Deve essere un doppione
        });
  
        return allDoppioni;
      });
        console.log('Scambi trovati per scambio multiplo:', allExchanges.length);
        console.log('Scambi filtrati:', availableExchanges.length);
      res.status(200).json({ exchanges: availableExchanges });
    } catch (error) {
      console.error('Errore nel recupero degli scambi multipli disponibili:', error);
      res.status(500).json({ message: 'Errore nel recupero degli scambi multipli disponibili' });
    }
};


exports.getCreditiExchanges = async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'Utente non trovato' });
  
      const allExchanges = await Exchange.find({ status: 'pending', type: 'crediti', offeredBy: { $ne: userId } }).populate('offeredBy', 'name');
  
      const availableExchanges = allExchanges.filter(exchange => {
        return user.credits >= exchange.creditAmount; // L'utente deve avere abbastanza crediti
      });
        console.log('Scambi trovati per vendita crediti:', allExchanges.length);
        console.log('Scambi filtrati:', availableExchanges.length);
      res.status(200).json({ exchanges: availableExchanges });
    } catch (error) {
      console.error('Errore nel recupero degli scambi per crediti disponibili:', error);
      res.status(500).json({ message: 'Errore nel recupero degli scambi per crediti disponibili' });
    }
};


exports.acceptExchange = async (req, res) => {
    try {
        const userId = req.user.userId;
        const exchangeId = req.params.id;
    
        const exchange = await Exchange.findById(exchangeId);
        if (!exchange || exchange.status !== 'pending') {
            return res.status(404).json({ message: 'Scambio non trovato o già concluso' });
        }

        console.log('Scambio:', exchange.type);
    
        const album = await Album.findOne({ userId });
        if (!album) return res.status(404).json({ message: 'Album non trovato' });
  
        if (exchange.type === 'doppioni') {
            // Verifica se l'utente ha la figurina richiesta come doppione
            for (const fig of exchange.requestedFigurines) {
                const found = album.figurine.find(f => f.idMarvel === fig.idMarvel);
                if (!found || found.count <= 1) {
                    return res.status(400).json({ message: 'Non hai i doppioni richiesti per accettare questo scambio' });
                }
            }
    
            // Aggiorna l'album rimuovendo le richieste e aggiungendo le offerte
            exchange.requestedFigurines.forEach(fig => {
            const index = album.figurine.findIndex(f => f.idMarvel === fig.idMarvel);
            album.figurine[index].count -= 1;
            if (album.figurine[index].count === 0) album.figurine.splice(index, 1);
            });

            for (const fig of exchange.offeredFigurines) {
                const figurina = await Figurina.findOne({ idMarvel: fig.idMarvel });
                const existing = album.figurine.find(f => f.idMarvel === fig.idMarvel);
                if (existing) existing.count += 1;
                else album.figurine.push({ idMarvel: figurina.idMarvel, name: figurina.name, image: figurina.image, count: 1 });
            }

            await album.save();
            res.status(200).json({ message: 'Scambio accettato con successo', exchange });

        } else if (exchange.type === 'multiplo') {
            for (const fig of exchange.requestedFigurines) {
                const found = album.figurine.find(f => f.idMarvel === fig.idMarvel);
                if (!found || found.count <= 1) return res.status(400).json({ message: 'Non hai i doppioni richiesti' });
                found.count -= 1;
                if (found.count === 0) album.figurine = album.figurine.filter(f => f.idMarvel !== fig.idMarvel);
            }
            for (const fig of exchange.offeredFigurines) {
                const figurina = await Figurina.findOne({ idMarvel: fig.idMarvel });
                const existing = album.figurine.find(f => f.idMarvel === fig.idMarvel);
                if (existing) existing.count += 1;
                else album.figurine.push({ idMarvel: figurina.idMarvel, name: figurina.name, image: figurina.image, count: 1 });
            }
            await album.save();
        } else if (exchange.type === 'crediti') {
            const user = await User.findById(userId);
            if (user.credits < exchange.creditAmount) return res.status(400).json({ message: 'Crediti insufficienti' });
            user.credits -= exchange.creditAmount;
            for (const fig of exchange.offeredFigurines) {
                const figurina = await Figurina.findOne({ idMarvel: fig.idMarvel });
                const existing = album.figurine.find(f => f.idMarvel === fig.idMarvel);
                if (existing) existing.count += 1;
                else album.figurine.push({ idMarvel: figurina.idMarvel, name: figurina.name, image: figurina.image, count: 1 });
            }
            await album.save();
            await user.save();
        } 
        exchange.status = 'accepted';
        await exchange.save();
        res.status(200).json({ message: 'Scambio accettato con successo', exchange });

    } catch (error) {
      console.error('Errore nell accettare lo scambio:', error);
      res.status(500).json({ message: 'Errore interno del server' });
    }
};



exports.rejectExchange = async (req, res) => {
    try {
        const userId = req.user.userId;
        const exchangeId = req.params.id;

        const exchange = await Exchange.findById(exchangeId);
        if (!exchange || exchange.status !== 'pending') {
            return res.status(404).json({ message: 'Scambio non trovato o già concluso' });
        }

        exchange.status = 'rejected';
        await exchange.save();

        res.status(200).json({ message: 'Scambio rifiutato con successo', exchange });

    } catch (error) {
        console.error('Errore nel rifiuto dello scambio:', error);
        res.status(500).json({ message: 'Errore interno del server' });
    }
};
