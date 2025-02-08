

document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const buyPackBtn = document.getElementById("buy-pack-btn");
    const packPreview = document.getElementById("pack-preview");
    const confirmPackBtn = document.getElementById("confirm-pack-btn");

    let newFigurine = [];

    buyPackBtn.addEventListener("click", async () => {
        try {
            console.log("🔹 Acquisto pacchetto...");

            const response = await fetch("http://localhost:5000/api/album/buy-pack", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error("Errore nell'acquisto del pacchetto");
            }

            const data = await response.json();
            newFigurine = data.newFigurine; // Salviamo le figurine trovate

            console.log("✅ Figurine trovate:", newFigurine);

            // Mostriamo le figurine trovate
            packPreview.innerHTML = "";
            newFigurine.forEach(figurina => {
                const card = document.createElement("div");
                card.className = "col";
                card.innerHTML = `
                    <div class="card">
                        <img src="${figurina.image}" class="card-img-top" alt="${figurina.name}">
                        <div class="card-body">
                            <h5 class="card-title">${figurina.name}</h5>
                        </div>
                    </div>
                `;
                packPreview.appendChild(card);
            });

            packPreview.classList.remove("d-none");
            confirmPackBtn.classList.remove("d-none");

        } catch (error) {
            console.error("❌ Errore:", error);
        }
    });

    confirmPackBtn.addEventListener("click", async () => {
        console.log("🔹 Aggiungiamo le figurine all'album...");
        // Qui aggiungeremo la funzione per salvare le figurine nel database
    });
});



/*document.addEventListener("DOMContentLoaded", async () => {

    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    console.log("Token:", token); // Debug

    const albumContainer = document.getElementById("album-container");
    const emptyMessage = document.getElementById("empty-message");

    try {
        const response = await fetch("http://localhost:5000/api/album", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Invia il token al server
            }
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Errore API:", error.message); // Log dell'errore API
            throw new Error("Errore nel caricamento dell'album");
        }

        const album = await response.json();
        
        if (album.figurine.length === 0) {
            emptyMessage.classList.remove("d-none");
        } else {
            album.figurine.forEach(figurina => {
                const card = document.createElement("div");
                card.className = "col";
                card.innerHTML = `
                    <div class="card shadow-sm">
                        <img src="${figurina.image}" class="card-img-top" alt="${figurina.name}">
                        <div class="card-body">
                            <h5 class="card-title">${figurina.name}</h5>
                            <p class="card-text">${figurina.description || "Nessuna descrizione disponibile"}</p>
                            <a href="hero.html?id=${figurina.idMarvel}" class="btn btn-primary">Dettagli</a>
                        </div>
                    </div>
                `;
                albumContainer.appendChild(card);
            });
        }
    } catch (error) {
        console.error("Errore:", error);
        emptyMessage.textContent = "Errore nel caricamento dell'album.";
        emptyMessage.classList.remove("d-none");
    }
});*/



/*document.addEventListener("DOMContentLoaded", async () => {
    console.log("🔹 Testiamo il recupero di supereroi da Marvel API...");

    try {
        const response = await getFromMarvel("public/characters", "limit=5");
        console.log("✅ Supereroi ricevuti:", response);
    } catch (error) {
        console.error("❌ Errore nel recupero dei supereroi:", error);
    }
});



document.addEventListener("DOMContentLoaded", async () => {
    console.log("🔹 Recuperiamo supereroi da Marvel API...");

    const albumContainer = document.getElementById("album-container");

    try {
        // Otteniamo i dati dalle API Marvel
        const response = await getFromMarvel("public/characters", "limit=10");
        const heroes = response.data.results;  // Estraggo l'array dei supereroi

        console.log("✅ Supereroi ricevuti:", heroes);

        // Simuliamo le figurine possedute (da MongoDB in futuro)
        const figurinePossedute = [1011334, 1017100]; // Esempio: l'utente ha solo 3-D Man e A-Bomb

        heroes.forEach(hero => {
            const heroId = hero.id;
            const hasFigurina = figurinePossedute.includes(heroId); // Controlliamo se l'utente ha la figurina

            // Creiamo la card della figurina
            const card = document.createElement("div");
            card.className = "col";

            card.innerHTML = `
                <div class="card shadow-sm ${hasFigurina ? "" : "opacity-50"}">
                    <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" class="card-img-top" alt="${hero.name}">
                    <div class="card-body">
                        <h5 class="card-title">${hero.name}</h5>
                        <p class="card-text">${hero.description || "Nessuna descrizione disponibile"}</p>
                        ${hasFigurina ? `<a href="hero.html?id=${heroId}" class="btn btn-primary">Dettagli</a>` : ""}
                    </div>
                </div>
            `;

            albumContainer.appendChild(card);
        });

    } catch (error) {
        console.error("❌ Errore nel recupero dei supereroi:", error);
    }
});*/

