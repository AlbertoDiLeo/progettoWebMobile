

document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const albumContainer = document.getElementById("album-container");
    const cardTemplate = document.getElementById("card-template");

    try {
        const albumResponse = await fetch("http://localhost:3000/api/album", {
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



let figurineOriginali = []; // Manteniamo una copia originale delle figurine

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

    let figurine = []; // Array principale con le figurine filtrate
    let currentPage = 1;
    const itemsPerPage = 20;

    try {
        const albumResponse = await fetch("http://localhost:3000/api/album", {
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
        figurineOriginali = [...figurine]; // Copiamo i dati originali

        renderAlbum();

    } catch (error) {
        console.error("Errore nel recupero dell'album:", error);
    }

    function renderAlbum() {
        albumContainer.innerHTML = "";

        let sortedFigurine = [...figurine]; // Copia dell'array attuale (filtrato o meno)

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
            case "duplicate-alphabetical":
                sortedFigurine = sortedFigurine.filter(hero => hero.count > 1)
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

    /*searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();

        if (query === "") {
            figurine = [...figurineOriginali]; // Ripristina l'array originale
        } else {
            figurine = figurineOriginali.filter(hero =>
                hero.name.toLowerCase().includes(query)
            );
        }

        currentPage = 1;
        renderAlbum();
    });*/

    /*searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
    
        if (query === "") {
            figurine = [...figurineOriginali]; // Ripristina l'array originale
        } else {
            figurine = figurineOriginali.filter(hero =>
                hero.name.toLowerCase().startsWith(query) // Filtra solo per inizio parola
            );
        }
        
        if (figurine.length === 0) {
        currentPage = 1;
        renderAlbum();
        }
    });*/

    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        const noResultsMessage = document.getElementById("no-results-message");
    
        // Gestisce la visibilità del messaggio di nessun risultato
        if (query === "") {
            figurine = [...figurineOriginali]; // Ripristina l'array originale
            noResultsMessage.classList.add("d-none");
        } else {
            figurine = figurineOriginali.filter(hero =>
                hero.name.toLowerCase().startsWith(query) // Filtra solo per inizio parola
            );
        }
    
        if (figurine.length === 0) {
            noResultsMessage.classList.remove("d-none");
            albumContainer.innerHTML = ""; // Pulisce il contenitore se non ci sono risultati
        } else {
            noResultsMessage.classList.add("d-none");
            currentPage = 1;
            renderAlbum();
        }
    });
    


    

    // Aggiunge evento per l'ordinamento
    sortOptions.addEventListener("change", () => {
        currentPage = 1;
        renderAlbum();
    });
});











