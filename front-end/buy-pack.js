

let newFigurine = [];  // Variabile globale per salvare le figurine trovate


document.addEventListener("DOMContentLoaded", async () => {
    //console.log("Acquisto pacchetto all'apertura della pagina...");

    const token = getToken();
    if (!token) {
        console.error("Nessun token trovato. Reindirizzamento alla login...");
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

        //console.log(`Pacchetto acquistato! Crediti rimanenti: ${data.credits}`, "success");


        if (data.credits !== undefined && data.credits !== null) {
        localStorage.setItem("credits", data.credits);
        console.log("✅ Crediti aggiornati e salvati:", data.credits);
        } else {
            console.error("❌ Errore: il server non ha restituito i crediti aggiornati!", data);
        }


        if (!response.ok || !data.figurine) {
            throw new Error(data.message || "Errore nell'acquisto del pacchetto");
        }

        const packContainer = document.getElementById("pack-container");
        if (!packContainer) {
            console.error("ERRORE: Elemento 'pack-container' non trovato in buy-pack.html");
            return;
        }
        packContainer.innerHTML = ""; // Puliamo il contenuto precedente

        let figurineScelte = [...data.figurine]; // Lista temporanea di figurine trovate

        function aggiornaVisualizzazione() {
            packContainer.innerHTML = "";
            figurineScelte.forEach((figurina, index) => {
                const card = document.createElement("div");
                card.className = "col";
                card.id = `figurina-${index}`;
                card.innerHTML = `
                    <div class="card shadow-sm">
                        <img src="${figurina.image}" class="card-img-top" alt="${figurina.name}">
                        <div class="card-body">
                            <h5 class="card-title">${figurina.name}</h5>
                            <p class="card-text">${figurina.description || "Nessuna descrizione disponibile"}</p>
                            <button class="btn btn-success add-to-album" data-index="${index}">✅ Aggiungi</button>
                            <button class="btn btn-danger discard" data-index="${index}">❌ Scarta</button>
                        </div>
                    </div>
                `;
                packContainer.appendChild(card);
            });

            if (figurineScelte.length === 0) {
                packContainer.innerHTML = "<p>Non hai aggiunto nessuna figurina all'album.</p>";
            }
        }

        aggiornaVisualizzazione();

        // Evento per aggiungere una figurina all'album con effetto
        packContainer.addEventListener("click", async (event) => {
            if (event.target.classList.contains("add-to-album")) {
                const index = event.target.getAttribute("data-index");
                const figurinaDaAggiungere = figurineScelte[index];
                const cardElement = document.getElementById(`figurina-${index}`);

                //console.log("Aggiunta figurina all'album:", figurinaDaAggiungere);

                cardElement.classList.add("adding");
                // Attendi la fine dell'animazione prima di rimuoverlo dal DOM
                setTimeout(async () => {
                    await fetch("http://localhost:5000/api/album/add-to-album", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ figurine: [figurinaDaAggiungere] })
                    });
                    figurineScelte.splice(index, 1);
                    cardElement.remove();
                    aggiornaVisualizzazione();
                }, 500);
            }
        });

        packContainer.addEventListener("click", (event) => {
            if (event.target.classList.contains("discard")) {
                const index = event.target.getAttribute("data-index");
                const cardElement = document.getElementById(`figurina-${index}`);
                //console.log("Figurina scartata:", figurineScelte[index]);
                // Effetto di scarto
                cardElement.classList.add("discarding");
                // Attendi la fine dell'animazione prima di rimuoverlo dal DOM
                setTimeout(() => {
                    figurineScelte.splice(index, 1);
                    cardElement.remove();
                    aggiornaVisualizzazione();
                }, 500);
            }
        });

    } catch (error) {
        console.error("Errore:", error);
        document.getElementById("pack-container").innerHTML = "<p>Errore nell'acquisto del pacchetto.</p>";
    }
});




