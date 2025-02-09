/*document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

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
        const packPreview = document.getElementById("pack-preview");
        const confirmPackBtn = document.getElementById("confirm-pack-btn");

        console.log("✅ Figurine trovate:", data.newFigurine);
        
        packPreview.innerHTML = "";
        data.newFigurine.forEach(figurina => {
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
        console.error("Errore:", error);
    }
});*/



document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const packPreview = document.getElementById("pack-preview");
    const confirmPackBtn = document.getElementById("confirm-pack-btn");

    // 🔹 Nascondiamo il bottone finché le figurine reali non sono visibili
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

        console.log("✅ Figurine trovate:", data.newFigurine);
        
        packPreview.innerHTML = ""; // 🔹 Rimuoviamo le card di caricamento
        data.newFigurine.forEach(figurina => {
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
});
