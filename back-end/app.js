require('dotenv').config(); // Carica variabili di ambiente dal file .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const { populateFigurine } = require("./controllers/marvelController");
const authRoutes = require('./routes/authRoutes');
const userRoutes = require("./routes/userRoutes");
const albumRoutes = require('./routes/albumRoutes');
const marvelRoutes = require('./routes/marvelRoutes');
const exchangeRoutes = require('./routes/exchangeRoutes');
//const Figurina = require("./models/figurina");

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger-output.json');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.use("/api/user", userRoutes);

app.use('/api/album', albumRoutes);

app.use('/api/marvel', marvelRoutes);

app.use('/api/exchange', exchangeRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log('Swagger disponibile su http://localhost:3000/api-docs');

/*const resetFigurine = async () => {
    await Figurina.deleteMany({});
    console.log("Reset della collection 'figurine'");
    //await populateFigurine();
};
resetFigurine();*/

/*app.use((req, res, next) => {
    console.log(`Richiesta ricevuta: ${req.method} ${req.url}`);
    next();
});*/



// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connessione a MongoDB riuscita"))
    .catch(err => console.error("Errore nella connessione a MongoDB:", err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
    await populateFigurine(); // Popola la collection con i 100 eroi casuali
});