





/*const { getFromMarvel } = require("../utils/marvel");

exports.createAlbum = async (req, res) => {
    try {
        const userId = req.user.id;

        // Controlliamo se l'utente ha già un album
        let album = await Album.findOne({ userId });
        if (album) {
            return res.status(400).json({ message: "Album già esistente" });
        }

        console.log("🔹 Creazione album per userId:", userId);

        // Recuperiamo la lista di figurine disponibili (limitate per evitare un album infinito)
        const ALBUM_HERO_LIMIT = 100;  // Decidiamo quante figurine possono esistere nell'album
        const response = await getFromMarvel("public/characters", `limit=${ALBUM_HERO_LIMIT}&offset=0`);
        
        if (!response || !response.data || !response.data.results) {
            return res.status(500).json({ message: "Errore nel recupero delle figurine iniziali" });
        }

        const allHeroes = response.data.results.map(hero => ({
            idMarvel: hero.id,
            name: hero.name,
            image: `${hero.thumbnail.path}.${hero.thumbnail.extension}`,
            count: 0 // Segna che la figurina non è ancora stata trovata
        }));

        // Creiamo un album con tutte le figurine disponibili, ma con count = 0
        album = new Album({ userId, figurine: allHeroes });
        await album.save();

        console.log("✅ Album creato con figurine iniziali sfocate:", album);
        
        res.status(201).json({ message: "Album creato con successo", album });

    } catch (error) {
        console.error("❌ Errore nella creazione dell'album:", error);
        res.status(500).json({ message: "Errore nella creazione dell'album", error });
    }
};





document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const albumContainer = document.getElementById("album-container");

    try {
        // 🔹 Recuperiamo le figurine dell'album
        const albumResponse = await fetch("http://localhost:5000/api/album", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        if (!albumResponse.ok) {
            throw new Error("Errore nel recupero dell'album");
        }

        const albumData = await albumResponse.json();

        console.log("✅ Album ricevuto:", albumData);

        albumData.figurine.forEach(figurina => {
            const hasFigurina = figurina.count > 0;  // Se count > 0, l'utente ha trovato la figurina
            const card = document.createElement("div");
            card.className = "col";

            card.innerHTML = `
                <div class="card shadow-sm ${hasFigurina ? "" : "opacity-50"}">
                    <img src="${hasFigurina ? figurina.image : 'placeholder.png'}" 
                         class="card-img-top" alt="${figurina.name}">
                    <div class="card-body">
                        <h5 class="card-title">${figurina.name}</h5>
                        ${hasFigurina ? `<span class="badge bg-secondary">x${figurina.count}</span>` : ""}
                    </div>
                </div>
            `;

            albumContainer.appendChild(card);
        });

    } catch (error) {
        console.error("❌ Errore nel recupero dell'album:", error);
    }
});
*/