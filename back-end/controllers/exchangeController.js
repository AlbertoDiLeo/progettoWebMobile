const Exchange = require('../models/exchange');
const User = require('../models/user');


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
        const { offeredFigurina, requestedFigurina } = req.body;

        // Creiamo il nuovo scambio
        const newExchange = new Exchange({
            offeredBy: req.user.id, // ID dell'utente autenticato
            offeredFigurina,
            requestedFigurina,
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
};
