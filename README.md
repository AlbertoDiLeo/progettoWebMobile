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
│   ├── profile.html                 # Gestione del profilo utente (collegata al back-end)
│   ├── album.html                   # Visualizzazione e gestione dell'album => mettere barra di ricerca
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








profile.html:

    Permette agli utenti di modificare le informazioni personali.
    Collegata al back-end per gestire il profilo.

album.html:

    Visualizzazione di tutte le figurine raccolte.
    Griglia o tabella con dettagli delle figurine.
    barra di ricerca.

exchange.html:

    Gestione degli scambi di figurine.
    Form per proporre nuovi scambi.

credits.html:

    Visualizza il saldo dei crediti.
    Pulsante o form per acquistare nuovi crediti.

statistics.html:

    Visualizza i progressi dell'utente.
    Percentuale di completamento dell'album, figurine doppie, ecc.

logout.html:

    Conferma il logout e reindirizza alla pagina principale.