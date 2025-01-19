require('dotenv').config(); // Carica variabili di ambiente dal file .env
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware per parsing JSON
app.use(express.json());

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connessione a MongoDB riuscita"))
    .catch(err => console.error("Errore nella connessione a MongoDB:", err));

// Rotta di test
app.get('/', (req, res) => res.send('Server connesso a MongoDB!'));

// Avvia il server
app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));

/*
Caricato Variabili di Ambiente:

    Usiamo dotenv per mantenere sicure informazioni sensibili come la connessione a MongoDB.

Configurato un Server Base:

    Con Express abbiamo creato un server che risponde con un messaggio semplice quando visiti la rotta /.

Gestito la Connessione a MongoDB:

    Usiamo Mongoose per connetterci al database.*/