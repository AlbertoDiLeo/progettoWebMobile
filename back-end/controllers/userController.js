const bcrypt = require("bcryptjs");
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
            return res.status(400).json({ error: "La data di nascita non è valida!" });
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



exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.userId; 

        const { oldPassword, newPassword } = req.body;

        //console.log("🔍 DEBUG - Cambio password per userId:", userId);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Utente non trovato." });
        }

        // ✅ Verifica se la vecchia password è corretta
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "❌ Vecchia password errata." });
        }

        // ✅ Hash della nuova password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        //console.log("✅ DEBUG - Password cambiata con successo");
        res.json({ message: "Password aggiornata con successo!" });

    } catch (error) {
        console.error("⛔ DEBUG - Errore durante il cambio password:", error);
        res.status(500).json({ error: "Errore del server." });
    }
};


exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.userId; // Ottenere l'ID dal token

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Utente non trovato." });
        }

        await User.findByIdAndDelete(userId);

        //console.log("Account eliminato con successo");
        res.json({ message: "Account eliminato con successo!" });

    } catch (error) {
        console.error("Errore durante l'eliminazione dell'account:", error);
        res.status(500).json({ error: "Errore del server." });
    }
};
