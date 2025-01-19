progetto-afse/
├── front-end/
│   ├── css/
│   │   └── styles.css               # Stile personalizzato del progetto
│   ├── js/
│   │   └── scripts.js               # Script JavaScript lato client
│   ├── img/
│   │   └── (immagini statiche, icone, ecc.)
│   ├── index.html                   # Pagina principale del sito
│   ├── login.html                   # Pagina di login
│   ├── register.html                # Pagina di registrazione
│   ├── dashboard.html               # Dashboard dell'utente
│   ├── profile.html                 # Gestione del profilo utente
│   ├── album.html                   # Visualizzazione e gestione dell'album
│   ├── exchange.html                # Scambio figurine
│   ├── credits.html                 # Gestione e acquisto crediti
│   ├── statistics.html              # Statistiche dell'album
│   └── logout.html                  # Pagina di logout o conferma
├── back-end/
│   ├── controllers/
│   │   └── userController.js        # Gestione utenti (es. login, registrazione)
│   │   └── albumController.js       # Gestione dell'album e figurine
│   │   └── exchangeController.js    # Gestione degli scambi di figurine
│   ├── models/
│   │   └── user.js                  # Modello utente per MongoDB
│   │   └── album.js                 # Modello album per MongoDB
│   ├── routes/
│   │   └── userRoutes.js            # Rotte utenti (es. login, registrazione)
│   │   └── albumRoutes.js           # Rotte per l'album
│   │   └── exchangeRoutes.js        # Rotte per lo scambio di figurine
│   ├── config/
│   │   └── db.js                    # Configurazione connessione MongoDB
│   ├── app.js                       # Configurazione principale di Node.js
│   ├── package.json                 # Dipendenze del progetto
│   ├── swagger.json                 # Documentazione API con Swagger
│   └── .env                         # Variabili di ambiente
├── docs/
│   └── relazione.pdf                # Documentazione del progetto
├── tests/
│   ├── user.test.js                 # Test per login e registrazione
│   ├── album.test.js                # Test per gestione dell'album
│   └── exchange.test.js             # Test per lo scambio figurine
└── README.md                        # Descrizione del progetto
