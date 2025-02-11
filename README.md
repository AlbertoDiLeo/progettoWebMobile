progetto-afse/
├── front-end/
│   ├── css/
│   │   └── styles.css               # Stile personalizzato del progetto
│   ├── js/
|   |   ├── auth.js                  # Script per login, registrazione logout e controlli
│   │   ├── lib.js                   # Script JavaScript lato client
|   |   ├── dashboard.js             # Script per dashboard
|   |   ├── profile.js               # Script per il profilo
|   |   ├── album.js                 # Script per l'album
|   |   ├── buy-pack.js              # Script per il pacchetto acquistato
|   |   └── hero-details.js
│   ├── img/
│   │   └── (immagini statiche, icone, ecc.)
│   ├── index.html                   # Pagina principale del sito
│   ├── login.html                   # Pagina di login
│   ├── register.html                # Pagina di registrazione
│   ├── dashboard.html               # Dashboard dell'utente
│   ├── profile.html                 # Gestione del profilo utente
│   ├── album.html                   # Visualizzazione e gestione dell'album
│   ├── exchange.html                # Scambio figurine
│   ├── statistics.html              # Statistiche dell'album
|   ├── buy-pack.html                # Acquisto pacchetto
|   ├── statistics.html              # Statistiche album
|   └── hero-details.html
|  
├── back-end/
│   ├── controllers/
│   │   ├── authController.js        # Logica per registrazione e login
│   │   ├── userController.js        # Logica per operazioni sugli utenti
│   │   ├── albumController.js       # Logica per gestione dell'album e figurine
|   |   └── marvelController.js      # Logica per la gestione delle figurine di marvel
|   ├── middleware/
│   │   └── authMiddleware.js        # Middleware per l'autenticazione
│   ├── models/
│   │   ├── user.js                  # Modello utente per MongoDB
│   │   ├── album.js                 # Modello album per MongoDB
|   |   └── figurine.js              # Modello per le figurine
│   ├── routes/
│   │   ├── authRoutes.js            # Rotte per autenticazione (login, registrazione)
│   │   ├── userRoutes.js            # Rotte per operazioni generali sugli utenti
│   │   ├── albumRoutes.js           # Rotte per gestione album e figurine
|   |   └── marvelRoutes.js
│   ├── config/
│   │   └── db.js                    # Configurazione connessione a MongoDB
│   ├── app.js                       # Configurazione principale di Node.js
|   ├── marvel.js                    # API Marvel
│   ├── package.json                 # Dipendenze del progetto
│   ├── .env                         # Variabili di ambiente (es. credenziali MongoDB)
│   └── swagger.json                 # Documentazione delle API con Swagger
├── docs/
│   └── relazione.pdf                # Documentazione del progetto
├── tests/
│   ├── auth.test.js                 # Test per registrazione e login
│   ├── user.test.js                 # Test per operazioni sul profilo utente
│   └── album.test.js                # Test per gestione dell'album
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