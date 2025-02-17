

let token = localStorage.getItem("token");
let figurinePossedute = [];
let tutteLeFigurine = [];

document.addEventListener("DOMContentLoaded", async () => {
    if (!token) {
        window.location.href = "login.html";
        return;
    }

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
        figurinePossedute = albumData.figurine
            .filter(f => f.found)
            .map(f => f.idMarvel);

        const response = await fetch("http://localhost:3000/api/album/buy-pack", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        const data = await response.json();
        if (!response.ok || !data.figurine) {
            throw new Error(data.message || "Errore nell'acquisto del pacchetto");
        }

        let figurineScelte = data.figurine.map(figurina => ({
            ...figurina,
            found: figurinePossedute.includes(figurina.idMarvel),
        }));

        tutteLeFigurine = tutteLeFigurine.concat(figurineScelte);
        aggiornaVisualizzazione(tutteLeFigurine);

        const packContainer = document.getElementById("pack-container");

        // Evento per aggiungere una figurina all'album
        packContainer.addEventListener("click", async (event) => {
            if (event.target.classList.contains("add-to-album")) {
                const index = parseInt(event.target.getAttribute("data-index"), 10);
                const figurinaDaAggiungere = tutteLeFigurine[index];
                const cardElement = document.getElementById(`figurina-${index}`);

                //cardElement.classList.add("adding"); 
                setTimeout(async () => {
                    await fetch("http://localhost:3000/api/album/add-to-album", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ figurine: [figurinaDaAggiungere] })
                    });

                    tutteLeFigurine.splice(index, 1);
                    cardElement.remove();
                    aggiornaVisualizzazione(tutteLeFigurine);
                }, 500);
            }
        });

        // Evento per scartare una figurina
        packContainer.addEventListener("click", (event) => {
            if (event.target.classList.contains("discard")) {
                const index = event.target.getAttribute("data-index");
                const cardElement = document.getElementById(`figurina-${index}`);

                //cardElement.classList.add("discarding"); 
                setTimeout(() => {
                    tutteLeFigurine.splice(index, 1);
                    cardElement.remove();
                    aggiornaVisualizzazione(tutteLeFigurine);
                }, 500);
            }
        });

        const buyAnotherPackButton = document.getElementById("buy-another-pack-btn");

        // Controlliamo i crediti dell'utente
        const profileResponse = await fetch("http://localhost:3000/api/user/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        const user = await profileResponse.json();

        if (user.credits < 1) {
            buyAnotherPackButton.classList.add("disabled");
        }

    } catch (error) {
        console.error("Errore nello spacchettamento:", error);
        document.getElementById("pack-container").innerHTML = "<p>Errore durante l'acquisto del pacchetto.</p>";
    }
});



document.addEventListener("DOMContentLoaded", async () => {

    const buyAnotherPackButton = document.getElementById("buy-another-pack-btn");

    // Controlliamo i crediti dell'utente
    const profileResponse = await fetch("http://localhost:3000/api/user/profile", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });
    const user = await profileResponse.json();

    // Evento per acquistare un nuovo pacchetto
    buyAnotherPackButton.addEventListener("click", async () => {

        try {      
            const buyResponse = await fetch("http://localhost:3000/api/album/buy-pack", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            const data = await buyResponse.json();
            if (!buyResponse.ok || !data.figurine) {
                throw new Error(data.message || "Errore nell'acquisto del pacchetto");
            }

            let newFigurineScelte = data.figurine.map(figurina => ({
                ...figurina,
                found: figurinePossedute.includes(figurina.idMarvel),
            }));

            tutteLeFigurine = tutteLeFigurine.concat(newFigurineScelte);

            aggiornaVisualizzazione(newFigurineScelte);
            user.credits = data.credits;

            if (user.credits < 1) {
                buyAnotherPackButton.classList.add("disabled");
            }

        } catch (error) {
            console.error("Errore nell'acquisto del pacchetto:", error);
        }
    });

});

function aggiornaVisualizzazione(figurineScelte) {
    const packContainer = document.getElementById("pack-container");
    const template = document.getElementById("card-template");
    const noCardsMessage = document.getElementById("no-cards-message");

    // Rimuove tutte le card tranne il template
    Array.from(packContainer.children).forEach(child => {
        if (child !== template) {
            child.remove();
        }
    });

    if (figurineScelte.length === 0) {
        noCardsMessage.classList.remove("d-none");
    } else {
        noCardsMessage.classList.add("d-none");
        figurineScelte.forEach((figurina, index) => {
            const cardClone = template.cloneNode(true);
            cardClone.classList.remove("d-none");
            cardClone.id = `figurina-${index}`;

            cardClone.querySelector("#card-image").src = figurina.image;
            cardClone.querySelector("#card-title").textContent = figurina.name;

            const addButton = cardClone.querySelector("#card-add");
            const discardButton = cardClone.querySelector("#card-discard");

            addButton.dataset.index = index;
            discardButton.dataset.index = index;

            if (!figurina.found) {
                const badge = cardClone.querySelector("#new-badge");
                badge.classList.remove("d-none");
            }

            addButton.addEventListener("click", () => {
                aggiungiFigurina(index, cardClone);
                cardClone.remove();
            });

            discardButton.addEventListener("click", () => {
                scartaFigurina(index, cardClone);
                cardClone.remove();
            });

            packContainer.appendChild(cardClone);
        });
    }
}




function aggiungiFigurina(index, cardElement) {
    const figurinaDaAggiungere = tutteLeFigurine[index];
    //cardElement.classList.add("adding"); 

    setTimeout(async () => {
        try {
            const response = await fetch("http://localhost:3000/api/album/add-to-album", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    idMarvel: figurinaDaAggiungere.idMarvel,
                    name: figurinaDaAggiungere.name,
                    image: figurinaDaAggiungere.image
                })
            });
    

            if (!response.ok) {
                throw new Error("Errore nell'aggiunta all'album");
            }
            tutteLeFigurine.splice(index, 1);
            aggiornaVisualizzazione(tutteLeFigurine);
        } catch (error) {
            console.error("Errore durante l'aggiunta all'album:", error);
            showNotification("Errore nell'aggiunta all'album", "danger");
        }
    }, 500);
}



function scartaFigurina(index) {
    const cardElement = document.getElementById(`figurina-${index}`);
    //cardElement.classList.add("discarding"); 

    setTimeout(() => {
        tutteLeFigurine.splice(index, 1);
        aggiornaVisualizzazione(tutteLeFigurine);
    }, 500);
}
