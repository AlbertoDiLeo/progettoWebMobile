progetto-afse/
├── front-end/
│   ├── css/
│   │   └── styles.css             # Stile personalizzato del progetto
│   ├── js/
│   │   └── scripts.js             # Script JavaScript lato client
│   ├── img/
│   │   └── (immagini statiche, icone, ecc.)
│   ├── index.html                 # Pagina principale dell'app 
│   ├── login.html                 # Pagina di login
│   ├── register.html              # Pagina di registrazione
│   ├── dashboard.html             # Pagina principale dell'album 
│   └── exchange.html              # Pagina per lo scambio di figurine
├── back-end/
│   ├── controllers/
│   │   └── userController.js      # Gestione delle operazioni utente (es. login, registrazione)
│   │   └── albumController.js     # Gestione dell'album e delle figurine
│   ├── models/
│   │   └── user.js                # Modello utente per MongoDB
│   │   └── album.js               # Modello album per MongoDB
│   ├── routes/
│   │   └── userRoutes.js          # Rotte per utenti (registrazione, login, ecc.)
│   │   └── albumRoutes.js         # Rotte per album e scambi
│   ├── config/
│   │   └── db.js                  # Configurazione connessione a MongoDB
│   ├── app.js                     # Configurazione principale di Node.js
│   ├── package.json               # Dipendenze del progetto
│   ├── swagger.json               # Documentazione delle API con Swagger
│   └── .env                       # Variabili di ambiente
├── docs/
│   └── relazione.pdf              # Documentazione del progetto
├── tests/
│   ├── user.test.js               # Test per il login e registrazione
│   ├── album.test.js              # Test per la gestione dell'album
│   └── exchange.test.js           # Test per gli scambi
└── README.md                      # Descrizione del progetto
