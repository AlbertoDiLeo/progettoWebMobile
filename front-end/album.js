
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
        //console.log("Numero di figurine nell'album:", albumData.figurine.length);

        albumContainer.innerHTML = "";

        albumData.figurine.forEach(hero => {
            const card = document.createElement("div");
            card.className = "col";

            card.innerHTML = `
                <div class="card shadow-sm ${hero.found ? "" : "opacity-50"}">
                    <img src="${hero.image}" class="card-img-top ${hero.found ? '' : 'blurred'}" alt="${hero.name}">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="card-title">${hero.name}</h5>
                            ${hero.found && hero.count > 1 ? `<span class="badge bg-danger">x${hero.count}</span>` : ""}
                        </div>
                        ${hero.found ? `<button class="btn btn-info view-details" data-id="${hero.idMarvel}">🔍 Vedi dettagli</button>` : ""}
                    </div>
                </div>
            `;

            albumContainer.appendChild(card);
        });

        document.querySelectorAll(".view-details").forEach(button => {
            button.addEventListener("click", (event) => {
                const heroId = event.target.getAttribute("data-id");
                window.location.href = `hero-details.html?id=${heroId}`;
            });
        });

    } catch (error) {
        console.error("Errore nel recupero dell'album:", error);
    }
});*/


document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const albumContainer = document.getElementById("album-container");
    const cardTemplate = document.getElementById("card-template");

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
            const cardClone = cardTemplate.cloneNode(true);
            cardClone.classList.remove("d-none");
            
            const img = cardClone.querySelector("#card-image");
            const title = cardClone.querySelector("#card-title");
            const detailsButton = cardClone.querySelector("#card-details");
            const badge = cardClone.querySelector("#card-badge");

            img.src = hero.image;
            img.alt = hero.name;
            title.textContent = hero.name;

            if (hero.found) {
                detailsButton.classList.remove("d-none");
                detailsButton.dataset.id = hero.idMarvel;
                detailsButton.addEventListener("click", () => {
                    window.location.href = `hero-details.html?id=${hero.idMarvel}`;
                });
                if (hero.count > 1) {
                    badge.textContent = `x${hero.count}`;
                    badge.classList.remove("d-none");
                }
            } else {
                cardClone.classList.add("opacity-50");
            }

            albumContainer.appendChild(cardClone);
        });

    } catch (error) {
        console.error("Errore nel recupero dell'album:", error);
    }
});



document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const albumContainer = document.getElementById("album-container");
    const cardTemplate = document.getElementById("card-template");
    const searchBar = document.getElementById("search-bar");

    let figurine = []; // Salva le figurine recuperate

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
        figurine = albumData.figurine;
        renderAlbum(figurine);

    } catch (error) {
        console.error("Errore nel recupero dell'album:", error);
    }

    /*function renderAlbum(filteredFigurine) {
        albumContainer.innerHTML = "";
        if (filteredFigurine.length === 0) {
            albumContainer.innerHTML = '<p class="text-center text-muted mt-3">Nessuna figurina trovata!</p>';
            return;
        }

        filteredFigurine.forEach(hero => {
            const cardClone = cardTemplate.cloneNode(true);
            cardClone.classList.remove("d-none");

            const img = cardClone.querySelector("#card-image");
            const title = cardClone.querySelector("#card-title");
            const detailsButton = cardClone.querySelector("#card-details");
            const badge = cardClone.querySelector("#card-badge");

            img.src = hero.image;
            img.alt = hero.name;
            title.textContent = hero.name;

            if (hero.found) {
                detailsButton.classList.remove("d-none");
                detailsButton.dataset.id = hero.idMarvel;
                detailsButton.addEventListener("click", () => {
                    window.location.href = `hero-details.html?id=${hero.idMarvel}`;
                });
                if (hero.count > 1) {
                    badge.textContent = `x${hero.count}`;
                    badge.classList.remove("d-none");
                }
            } else {
                cardClone.classList.add("opacity-50");
            }

            albumContainer.appendChild(cardClone);
        });
    }*/

    function renderAlbum(filteredFigurine) {
        albumContainer.innerHTML = "";
        if (filteredFigurine.length === 0) {
            albumContainer.innerHTML = '<p class="text-center text-muted mt-3">Nessuna figurina trovata!</p>';
            return;
        }

        filteredFigurine.forEach(hero => {
            const cardClone = cardTemplate.cloneNode(true);
            cardClone.classList.remove("d-none");

            const img = cardClone.querySelector("#card-image");
            const title = cardClone.querySelector("#card-title");
            const detailsButton = cardClone.querySelector("#card-details");
            const badge = cardClone.querySelector("#card-badge");

            img.src = hero.image;
            img.alt = hero.name;
            title.textContent = hero.name;

            if (hero.found) {
                cardClone.classList.add("figurina-trovata"); // Aggiunge l'animazione solo se trovata
                detailsButton.classList.remove("d-none");
                detailsButton.dataset.id = hero.idMarvel;
                detailsButton.addEventListener("click", () => {
                    window.location.href = `hero-details.html?id=${hero.idMarvel}`;
                });
                if (hero.count > 1) {
                    badge.textContent = `x${hero.count}`;
                    badge.classList.remove("d-none");
                }
            } else {
                cardClone.classList.add("opacity-50");
            }

            albumContainer.appendChild(cardClone);
        });
    }

   

    

    // Filtro automatico basato sulla ricerca
    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        const filteredFigurine = figurine.filter(hero => hero.name.toLowerCase().startsWith(query));
        renderAlbum(filteredFigurine);
    });
});








