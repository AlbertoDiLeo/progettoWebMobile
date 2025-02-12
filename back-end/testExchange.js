const mongoose = require("mongoose");
const User = require("./models/User");
const Album = require("./models/Album");
const Exchange = require("./models/Exchange");
const Figurina = require("./models/Figurina");

async function findValidExchange() {
    try {
        await mongoose.connect("mongodb+srv://albertodileo:Francesco70_@cluster0.k3kd8fo.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0");

        // **1️⃣ Troviamo due utenti casuali**
        const users = await User.find().limit(2);
        if (users.length < 2) {
            console.log("Errore: Servono almeno 2 utenti per testare uno scambio.");
            return;
        }

        const user1 = users[0];
        const user2 = users[1];

        // **2️⃣ Recuperiamo gli album di entrambi gli utenti**
        const album1 = await Album.findOne({ userId: user1._id });
        const album2 = await Album.findOne({ userId: user2._id });

        if (!album1 || !album2) {
            console.log("Errore: Uno dei due utenti non ha un album.");
            return;
        }

        // **3️⃣ Troviamo tutte le figurine doppione per ogni utente**
        const doppioniUser1 = album1.figurine.filter(f => f.count > 1);
        const doppioniUser2 = album2.figurine.filter(f => f.count > 1);

        if (doppioniUser1.length === 0 || doppioniUser2.length === 0) {
            console.log("Errore: Uno degli utenti non ha doppioni disponibili.");
            return;
        }

        // **4️⃣ Troviamo una combinazione valida**
        let scambioValido = null;

        for (const figurina1 of doppioniUser1) {
            for (const figurina2 of doppioniUser2) {
                const user2HasFigurina1 = album2.figurine.some(f => f.idMarvel === figurina1.idMarvel);
                const user1HasFigurina2 = album1.figurine.some(f => f.idMarvel === figurina2.idMarvel);

                if (!user2HasFigurina1 && !user1HasFigurina2) {
                    scambioValido = { figurina1, figurina2 };
                    break;
                }
            }
            if (scambioValido) break;
        }

        if (!scambioValido) {
            console.log("❌ Nessuna combinazione valida trovata.");
            return;
        }

        // **5️⃣ Recuperiamo l'`ObjectId` delle figurine basandoci su `idMarvel`**
        const offeredFigurina = await Figurina.findOne({ idMarvel: scambioValido.figurina1.idMarvel });
        const requestedFigurina = await Figurina.findOne({ idMarvel: scambioValido.figurina2.idMarvel });

        if (!offeredFigurina || !requestedFigurina) {
            console.log("❌ Errore: Non sono riuscito a trovare le figurine nel database.");
            return;
        }

        // **6️⃣ Creiamo lo scambio valido con gli `ObjectId` corretti**
        const newExchange = new Exchange({
            offeredBy: user1._id,
            offeredFigurina: offeredFigurina._id,  // Usiamo l'ObjectId corretto
            requestedFigurina: requestedFigurina._id,  // Usiamo l'ObjectId corretto
            status: "pending"
        });

        await newExchange.save();
        console.log("✅ Scambio creato con successo:", newExchange);

        console.log("offerto da:", user1.email);
        console.log("offerta:", offeredFigurina.name);
        console.log("richiesta:", requestedFigurina.name);
        console.log("status:", newExchange.status);

    } catch (error) {
        console.error("Errore nel generare uno scambio valido:", error);
    } finally {
        mongoose.connection.close();
    }
}

findValidExchange();