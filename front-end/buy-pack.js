

let newFigurine = [];  // 🔹 Variabile globale per salvare le figurine trovate

/*document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const packPreview = document.getElementById("pack-preview");
    const confirmPackBtn = document.getElementById("confirm-pack-btn");

    // 🔹 Nascondiamo il bottone finché le figurine non sono caricate
    confirmPackBtn.classList.add("d-none");

    // 🔹 Mostriamo le card vuote mentre carichiamo le figurine
    packPreview.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        const card = document.createElement("div");
        card.className = "col";
        card.innerHTML = `
            <div class="card placeholder-glow">
                <div class="card-img-top bg-secondary" style="height: 200px; opacity: 0.5;"></div>
                <div class="card-body">
                    <h5 class="card-title placeholder col-6"></h5>
                    <p class="card-text placeholder col-8"></p>
                </div>
            </div>
        `;
        packPreview.appendChild(card);
    }

    packPreview.classList.remove("d-none");

    try {
        console.log("🔹 Acquisto pacchetto all'apertura della pagina...");

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
        console.log("✅ Risposta ricevuta dal server:", data); // 🔹 DEBUG RISPOSTA
        console.log("✅ Figurine trovate:", data.newFigurine);

        newFigurine = data.newFigurine; // 🔹 Salviamo le figurine trovate

        packPreview.innerHTML = ""; // 🔹 Rimuoviamo le card di caricamento
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

        // 🔹 Ora che le figurine sono caricate, mostriamo il bottone
        confirmPackBtn.classList.remove("d-none");

    } catch (error) {
        console.error("❌ Errore:", error);
    }
});*/

document.addEventListener("DOMContentLoaded", async () => {
    console.log("🔹 Acquisto pacchetto all'apertura della pagina...");

    const token = getToken();
    if (!token) {
        console.error("❌ Nessun token trovato. Reindirizzamento alla login...");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/album/buy-pack", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        const data = await response.json();
        console.log("✅ Risposta ricevuta dal server:", data); // 🔹 DEBUG RISPOSTA

        if (!response.ok) {
            throw new Error(data.message || "Errore nell'acquisto del pacchetto");
        }

        if (!data || !data.figurine || !Array.isArray(data.figurine) || data.figurine.length === 0) {
            throw new Error("❌ Nessuna figurina trovata nel pacchetto!");
        }

        console.log("✅ Figurine trovate:", data.figurine); // 🔹 DEBUG FIGURINE

        const packContainer = document.getElementById("pack-container");
        packContainer.innerHTML = ""; // Puliamo il contenuto precedente

        data.figurine.forEach(figurina => {
            const card = document.createElement("div");
            card.className = "col";
            card.innerHTML = `
                <div class="card shadow-sm">
                    <img src="${figurina.image}" class="card-img-top" alt="${figurina.name}">
                    <div class="card-body">
                        <h5 class="card-title">${figurina.name}</h5>
                        <p class="card-text">${figurina.description || "Nessuna descrizione disponibile"}</p>
                    </div>
                </div>
            `;
            packContainer.appendChild(card);
        });

    } catch (error) {
        console.error("❌ Errore:", error);
        document.getElementById("pack-container").innerHTML = "<p>Errore nell'acquisto del pacchetto.</p>";
    }
});





document.getElementById("confirm-pack-btn").addEventListener("click", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        console.log("🔹 Aggiunta delle figurine all'album...");

        const response = await fetch("http://localhost:5000/api/album/add-to-album", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ figurine: newFigurine })  // Invio le figurine trovate
        });

        if (!response.ok) {
            throw new Error("Errore nell'aggiunta delle figurine all'album");
        }

        console.log("✅ Figurine aggiunte all'album con successo!");
        alert("Le figurine sono state aggiunte all'album!");

        // 🔹 Dopo l'aggiunta, forziamo il refresh dell'album
        setTimeout(() => {
            window.location.href = "album.html";  // Ricarichiamo la pagina dell'album
        }, 1000);

    } catch (error) {
        console.error("❌ Errore:", error);
    }
});

