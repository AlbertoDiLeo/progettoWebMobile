

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




/*document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const albumContainer = document.getElementById("album-container");
    const cardTemplate = document.getElementById("card-template");
    const searchBar = document.getElementById("search-bar");

    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");
    const pageIndicator = document.getElementById("page-indicator");

    let figurine = []; // Lista completa delle figurine
    let currentPage = 1;
    const itemsPerPage = 20; // Numero di figurine per pagina

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
        renderAlbum();

    } catch (error) {
        console.error("Errore nel recupero dell'album:", error);
    }

    function renderAlbum() {
        albumContainer.innerHTML = "";

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedFigurine = figurine.slice(startIndex, endIndex);

        paginatedFigurine.forEach(hero => {
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
                cardClone.classList.add("figurina-trovata");
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

        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage * itemsPerPage >= figurine.length;
        pageIndicator.textContent = `Pagina ${currentPage} di ${Math.ceil(figurine.length / itemsPerPage)}`;
    }

    nextButton.addEventListener("click", () => {
        if (currentPage * itemsPerPage < figurine.length) {
            currentPage++;
            renderAlbum();
        }
    });

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderAlbum();
        }
    });

    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        figurine = figurine.filter(hero => hero.name.toLowerCase().startsWith(query));
        currentPage = 1; // Reset alla prima pagina quando si filtra
        renderAlbum();
    });
});*/


document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const albumContainer = document.getElementById("album-container");
    const cardTemplate = document.getElementById("card-template");
    const searchBar = document.getElementById("search-bar");
    const sortOptions = document.getElementById("sort-options");

    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");
    const pageIndicator = document.getElementById("page-indicator");

    let figurine = []; // Tutte le figurine
    let currentPage = 1;
    const itemsPerPage = 20;

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
        renderAlbum();

    } catch (error) {
        console.error("Errore nel recupero dell'album:", error);
    }

    function renderAlbum() {
        albumContainer.innerHTML = "";

        let sortedFigurine = [...figurine]; // Copia dell'array originale

        switch (sortOptions.value) {
            case "alphabetical":
                sortedFigurine.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "found-alphabetical":
                sortedFigurine = sortedFigurine.filter(hero => hero.found)
                    .sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "not-found-alphabetical":
                sortedFigurine = sortedFigurine.filter(hero => !hero.found)
                    .sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        // Gestione della paginazione
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedFigurine = sortedFigurine.slice(startIndex, endIndex);

        paginatedFigurine.forEach(hero => {
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
                cardClone.classList.add("figurina-trovata");
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

        updatePaginationButtons(sortedFigurine);
    }

    function updatePaginationButtons(sortedFigurine) {
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage * itemsPerPage >= sortedFigurine.length;
        pageIndicator.textContent = `Pagina ${currentPage} di ${Math.ceil(sortedFigurine.length / itemsPerPage)}`;
    }

    nextButton.addEventListener("click", () => {
        if (currentPage * itemsPerPage < figurine.length) {
            currentPage++;
            renderAlbum();
        }
    });

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderAlbum();
        }
    });

    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        figurine = figurine.filter(hero => hero.name.toLowerCase().startsWith(query));
        currentPage = 1;
        renderAlbum();
    });

    // Aggiunge evento per l'ordinamento
    sortOptions.addEventListener("change", () => {
        currentPage = 1;
        renderAlbum();
    });
});










