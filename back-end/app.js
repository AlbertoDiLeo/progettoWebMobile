require('dotenv').config(); // Carica variabili di ambiente dal file .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa il middleware CORS
const { populateFigurine } = require("./controllers/figurineController");
//const Figurine = require("./models/figurine");


const app = express();

// Abilita CORS
app.use(cors());

// Middleware per parsing JSON (deve essere posizionato prima delle rotte)
app.use(express.json());

// Importa e usa le rotte
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Importa e usa le rotte per user
const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const albumRoutes = require('./routes/albumRoutes');
app.use('/api/album', albumRoutes);

/*const resetFigurine = async () => {
    await Figurine.deleteMany({});
    await populateFigurine();
};
resetFigurine();
populateFigurine();*/



app.use((req, res, next) => {
    console.log(`Richiesta ricevuta: ${req.method} ${req.url}`);
    next();
});

/*app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(middleware.route.path);
    } else if (middleware.name === "router") {
        middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
                console.log(handler.route.stack[0].method.toUpperCase(), handler.route.path);
            }
        });
    }
});*/



// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connessione a MongoDB riuscita"))
    .catch(err => console.error("Errore nella connessione a MongoDB:", err));

const PORT = process.env.PORT || 5000;

// Avvia il server
//app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));

app.listen(PORT, async () => {
    console.log(`🚀 Server in ascolto sulla porta ${PORT}`);
    await populateFigurine(); // Popola la collection con i 100 eroi casuali
});


/*
Caricato Variabili di Ambiente:

    Usiamo dotenv per mantenere sicure informazioni sensibili come la connessione a MongoDB.

Configurato un Server Base:

    Con Express abbiamo creato un server che risponde con un messaggio semplice quando visiti la rotta /.

Gestito la Connessione a MongoDB:

    Usiamo Mongoose per connetterci al database.*/