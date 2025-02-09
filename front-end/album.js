



/*document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const albumContainer = document.getElementById("album-container");

    try {
        // 🔹 Recuperiamo l'album dal backend
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
        const figurinePossedute = albumData.figurine.map(f => f.idMarvel); // Estrai gli ID
        const figurineCounts = albumData.figurine.reduce((acc, f) => {
            acc[f.idMarvel] = f.count;
            return acc;
        }, {});

        console.log("✅ Figurine possedute:", figurinePossedute);
        console.log("✅ Tutte le figurine disponibili:", albumData.allPossibleFigurines);

        // 🔹 Puliamo il contenitore prima di aggiornare l'album
        albumContainer.innerHTML = "";

        // 🔹 Mostriamo tutte le figurine disponibili, ma sfocate se non ancora trovate
        albumData.allPossibleFigurines.forEach(hero => {
            const heroId = hero.idMarvel;
            const hasFigurina = figurinePossedute.includes(heroId);
            const count = figurineCounts[heroId] || 0;  // Se è un doppione, mostriamo il numero

            // Creiamo la card della figurina
            const card = document.createElement("div");
            card.className = "col";

            card.innerHTML = `
                <div class="card shadow-sm ${hasFigurina ? "" : "opacity-50"}">
                    <img src="${hasFigurina ? hero.image : 'placeholder.png'}" 
                         class="card-img-top" alt="${hero.name}">
                    <div class="card-body">
                        <h5 class="card-title">${hero.name}</h5>
                        ${hasFigurina ? `<span class="badge bg-secondary">x${count}</span>` : ""}
                    </div>
                </div>
            `;

            albumContainer.appendChild(card);
        });

    } catch (error) {
        console.error("❌ Errore nel recupero dell'album:", error);
    }
});*/


/*document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const albumContainer = document.getElementById("album-container");

    try {
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
        const figurinePossedute = new Set(albumData.figurine.map(f => f.idMarvel));

        albumContainer.innerHTML = "";

        albumData.allPossibleFigurines.forEach(hero => {
            const hasFigurina = figurinePossedute.has(hero.idMarvel);

            const card = document.createElement("div");
            card.className = "col";

            card.innerHTML = `
                <div class="card shadow-sm ${hasFigurina ? "" : "opacity-50"}">
                    <img src="${hasFigurina ? hero.image : 'placeholder.png'}" 
                         class="card-img-top" alt="${hero.name}">
                    <div class="card-body">
                        <h5 class="card-title">${hero.name}</h5>
                    </div>
                </div>
            `;

            albumContainer.appendChild(card);
        });

    } catch (error) {
        console.error("❌ Errore nel recupero dell'album:", error);
    }
});*/


document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const albumContainer = document.getElementById("album-container");

    try {
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

        albumContainer.innerHTML = "";

        albumData.figurine.forEach(hero => {
            const card = document.createElement("div");
            card.className = "col";

            card.innerHTML = `
                <div class="card shadow-sm ${hero.found ? "" : "opacity-50"}">
                    
                    <img src="${hero.image}" class="card-img-top ${hero.found ? '' : 'blurred'}" alt="${hero.name}">
                    <div class="card-body">
                        <h5 class="card-title">${hero.name}</h5>
                        ${hero.found ? `<span class="badge bg-secondary">x${hero.count}</span>` : ""}
                    </div>
                </div>
            `;

            albumContainer.appendChild(card);
        });

    } catch (error) {
        console.error("❌ Errore nel recupero dell'album:", error);
    }
});





