require('dotenv').config(); // Carica variabili di ambiente dal file .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa il middleware CORS

const app = express();
const PORT = process.env.PORT || 5000;

console.log('JWT_SECRET:', process.env.JWT_SECRET);


// Abilita CORS
app.use(cors());

// Middleware per parsing JSON (deve essere posizionato prima delle rotte)
app.use(express.json());

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connessione a MongoDB riuscita"))
    .catch(err => console.error("Errore nella connessione a MongoDB:", err));

// Importa e usa le rotte
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Rotta di test (opzionale)
app.get('/', (req, res) => res.send('Server connesso a MongoDB!'));

// Avvia il server
app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));

app.use((req, res, next) => {
    console.log(`Richiesta ricevuta: ${req.method} ${req.url}`);
    next();
});

/*
Caricato Variabili di Ambiente:

    Usiamo dotenv per mantenere sicure informazioni sensibili come la connessione a MongoDB.

Configurato un Server Base:

    Con Express abbiamo creato un server che risponde con un messaggio semplice quando visiti la rotta /.

Gestito la Connessione a MongoDB:

    Usiamo Mongoose per connetterci al database.*/