User = require("../models/user");


exports.updateUserProfile = async (req, res) => {
    try {

        //console.log("🔍 DEBUG - Dati ricevuti per aggiornamento:", JSON.stringify(req.body, null, 2));
        //console.log("🔍 DEBUG - Parametro userId ricevuto:", req.params.id);
        //console.log("🔍 DEBUG - Utente autenticato dal token:", req.user);

        const { name, favoriteHero, birthDate, phone } = req.body;
        //console.log("Dati ricevuti per aggiornamento:", req.body);
        const userId = req.params.id;

        if (!req.user || req.user.userId !== userId) {  // 🔥 Problema di autorizzazione
            //console.log("⛔ DEBUG - Autorizzazione fallita: userId non corrisponde");
            return res.status(403).json({ error: "Non autorizzato" });
        }

        if (name && name.trim() !== "") {
            //console.log("🔍 DEBUG - Controllo disponibilità nome utente:", name);
            const existingUser = await User.findOne({ name });
            if (existingUser && existingUser._id.toString() !== userId) {
               // console.log("⛔ DEBUG - Nome utente già in uso:", name);
                return res.status(400).json({ error: "Nome utente già in uso. Scegline un altro." });
            }
        }
        

         // Controllo sulla data di nascita: deve essere la data di oggi
         const today = new Date().toISOString().split("T")[0]; // Ottieni la data di oggi nel formato YYYY-MM-DD
         if (birthDate && birthDate > today) {
            return res.status(400).json({ error: "La data di nascita non è valida! Deve essere oggi." });
         }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, favoriteHero, birthDate, phone },
            { new: true }
        );

        if (!updatedUser) {
            //console.log("⛔ DEBUG - Utente non trovato nel database");
            return res.status(404).json({ error: "Utente non trovato" });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error("Errore durante l'aggiornamento del profilo:", error);
        res.status(500).json({ error: `Errore del server: ${error.message}` });
    }
};
