const Exchange = require('../models/exchange');
const User = require('../models/user');


exports.createExchange = async (req, res) => { // Mancavano req e res
    try {
        const { offeredSticker, requestedSticker } = req.body;

        // Creiamo il nuovo scambio
        const newExchange = new Exchange({
            offeredBy: req.user.id, // ID dell'utente autenticato
            offeredSticker,
            requestedSticker,
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


exports.acceptExchange = async (req, res) => {
    try {
        const exchangeId = req.params.id;
        const userId = req.user.id; // Utente che sta accettando lo scambio

        // Trova lo scambio richiesto
        const exchange = await Exchange.findById(exchangeId);
        if (!exchange) {
            return res.status(404).json({ error: 'Scambio non trovato' });
        }

        // Controlliamo che l'utente abbia la figurina richiesta dallo scambio
        const user = await User.findById(userId);
        if (!user.album.includes(exchange.requestedSticker)) {
            return res.status(400).json({ error: 'Non possiedi la figurina richiesta per completare lo scambio' });
        }

        // Troviamo l'utente che ha creato lo scambio
        const offeredUser = await User.findById(exchange.offeredBy);
        if (!offeredUser) {
            return res.status(404).json({ error: 'Utente che ha creato lo scambio non trovato' });
        }

        // Scambiamo le figurine tra gli utenti
        offeredUser.album = offeredUser.album.filter(figurina => figurina.toString() !== exchange.offeredSticker.toString());
        offeredUser.album.push(exchange.requestedSticker);

        user.album = user.album.filter(figurina => figurina.toString() !== exchange.requestedSticker.toString());
        user.album.push(exchange.offeredSticker);

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
};
