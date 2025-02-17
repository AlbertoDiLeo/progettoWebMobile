progetto-afse/
├── front-end/
│   ├── css/
│   │   ├── style.css               # Pagina di stile per dashboard, statisitcs, profile
|   |   ├── album.css               # Pagina di stile per album, buy-pack, hero-details
|   |   ├── index.css               # Pagina di stile per index, login e register
|   |   └── exchange.css            # Pagina di stile per exchange e propose-exchange
│   ├── javascrpit/
|   |   ├── auth.js                  # Script per login, registrazione e controlli
│   │   ├── utils.js                 # Script showNotification, logout, checkUsername e PasswordStrength
|   |   ├── dashboard.js             # Script per dashboard
|   |   ├── profile.js               # Script per il profile
|   |   ├── album.js                 # Script per l'album
|   |   ├── buy-pack.js              # Script per il buy-pack
|   |   ├── hero-details.js          # Script per i dettagli dell'eroe selezionato nell'album
|   |   ├── statistics.js            # Script per statistics
|   |   ├── exchange.js              # Script per exchange
|   |   └── propose-exchange.js      # Script per propose-exchange.js
│   ├── img/
│   │   └── (immagini statiche e icona)
│   ├── html/
|   |   ├── index.html               # Pagina iniziale per scelta login o registrazione
│   |   ├── login.html               # Pagina di login
│   |   ├── register.html            # Pagina di registrazione
│   |   ├── dashboard.html           # Pagina home dell'utente che ha effettuato il login
│   |   ├── profile.html             # Pagina di modifica del profilo utente
│   |   ├── album.html               # Pagina di visualizzazione dell'album
│   |   ├── hero-details.html        # Pagina di visualizzazione dettagli dell'eroe selezionato nell'album
│   |   ├── statistics.html          # Pagina di visualizzazione statistiche figurine trovate 
|   |   ├── buy-pack.html            # Pagina che mostra cosa contiene il pacchetto comprato
|   |   ├── exchange.html            # Pagina di visualizzazion degli scambio di figurine disponibili
|   |   └── propose-exchange.html    # Pagina in cui si creano i tre tipi di scambi            
|  
├── back-end/
│   ├── controllers/
│   │   ├── authController.js        # Logica per registrazione e login
│   │   ├── userController.js        # Logica per operazioni sugli utenti
│   │   ├── albumController.js       # Logica per gestione dell'album 
|   |   ├── marvelController.js      # Logica per la gestione delle figurine marvel
|   |   └── exchangeController.js    # Logica per gli scambi 
|   ├── middlewares/
│   │   └── authMiddleware.js        # Middleware per l'autenticazione
│   ├── models/
│   │   ├── user.js                  # Modello utente per MongoDB
│   │   ├── album.js                 # Modello album per MongoDB
|   |   ├── figurine.js              # Modello figurine per MongoDB
|   |   └── exchange.js              # Modello scambi figurine per MongoDB
│   ├── routes/
│   │   ├── authRoutes.js            # Rotte per autenticazione (login, registrazione)
│   │   ├── userRoutes.js            # Rotte per operazioni generali sugli utenti
│   │   ├── albumRoutes.js           # Rotte per gestione album 
|   |   ├── marvelRoutes.js          # Rotte per figurine marvel
|   |   └── exchangeRoutes.js        # Rotte per scambi figurine
│   ├── config/
│   │   ├── swagger.json             # Documentazione delle API con Swagger
|   |   └──swagger-output.json       # Documentazione delle API con Swagger
│   ├── app.js                       # Configurazione principale di Node.js
|   ├── marvel.js                    # API Marvel
│   ├── package.json                 # Dipendenze del progetto
│   └── .env                         # Variabili di ambiente (es. credenziali MongoDB)
|
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


statistics.html:

    Visualizza i progressi dell'utente.
    Percentuale di completamento dell'album, figurine doppie, ecc.

