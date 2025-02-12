document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const exchangeForm = document.getElementById("exchangeForm");
    const offeredFigurinaSelect = document.getElementById("offeredFigurina");
    const requestedFigurinaSelect = document.getElementById("requestedFigurina");
    const exchangeList = document.getElementById("exchangeList");

    // **Caricare le figurine dell'utente per il form**
    async function loadUserFigurine() {
        try {
            const response = await fetch("http://localhost:5000/api/album", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
    
            if (!response.ok) throw new Error("Errore nel recupero dell'album");
    
            const userAlbum = await response.json();
            //console.log("Dati ricevuti dall'album:", userAlbum); // DEBUG
    
            // Controlliamo che l'album sia valido
            if (!userAlbum || !userAlbum.figurine || !Array.isArray(userAlbum.figurine)) {
                console.error("Nessuna figurina trovata o formato non valido!");
                return;
            }
    
            // **Figurine doppie (da offrire)**
            const doppioni = userAlbum.figurine.filter(figurina => figurina.count > 1)
                .sort((a, b) => a.name.localeCompare(b.name));
            
            // **Figurine mancanti (da richiedere)**
            const mancanti = userAlbum.figurine.filter(figurina => !figurina.found)
                .sort((a, b) => a.name.localeCompare(b.name));
    
            // Popoliamo i menu a tendina con gli **id**, ma mostriamo il nome
            offeredFigurinaSelect.innerHTML = doppioni.length > 0 
            ? doppioni.map(figurina => `<option value="${figurina.idMarvel}" data-name="${figurina.name}">${figurina.name} x${figurina.count}</option>`).join("")
            : `<option disabled>Nessuna figurina doppia</option>`;

            requestedFigurinaSelect.innerHTML = mancanti.length > 0
            ? mancanti.map(figurina => `<option value="${figurina.idMarvel}" data-name="${figurina.name}">${figurina.name}</option>`).join("")
            : `<option disabled>Tutte le figurine trovate</option>`;
    
        } catch (error) {
            console.error("Errore in loadUserFigurine:", error);
        }
    }
    

    // **Inviare una proposta di scambio**
    exchangeForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const offeredFigurinaId = offeredFigurinaSelect.value;
        const requestedFigurinaId = requestedFigurinaSelect.value;

        //console.log("🔹 Proposta di scambio:", offeredFigurinaId, requestedFigurinaId);

       // **Validazione: assicurarsi che entrambi i campi siano selezionati**
        if (!offeredFigurinaId || !requestedFigurinaId) {
            showNotification("Seleziona sia una figurina da offrire che una da richiedere!", "danger"); //non serve
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/exchange", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ offeredFigurinaId, requestedFigurinaId, })
            });

            if (!response.ok) throw new Error("Errore nella proposta di scambio");

            showNotification("Scambio proposto con successo!", "success"); //non va
            loadExchanges();
        } catch (error) {
            console.error(error);
        }

        setTimeout(() => { // è la soluzione migliore?
            location.reload();
        }, 50);
    });

    // **Caricare gli scambi disponibili**
    /*async function loadExchanges() {
        try {
            const response = await fetch("http://localhost:5000/api/exchange", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            if (!response.ok) throw new Error("Errore nel recupero degli scambi");
            const exchanges = await response.json();
    
            // Decodifichiamo il token per ottenere l'ID dell'utente attuale
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.userId;
    
            exchangeList.innerHTML = exchanges.map(exchange => {
                const isMyExchange = exchange.offeredBy === userId;
    
                return `
                    <div class="col-md-4">
                        <div class="card mt-3">
                            <div class="card-body">
                                <p><strong>Offerto:</strong> ${exchange.offeredFigurina.name}</p>
                                <p><strong>Richiesto:</strong> ${exchange.requestedFigurina.name}</p>
                                ${!isMyExchange ? `<button class="btn btn-success" onclick="acceptExchange('${exchange._id}')">Accetta Scambio</button>` : ""}
                                ${isMyExchange ? `<button class="btn btn-danger" onclick="withdrawExchange('${exchange._id}')">Ritira Scambio</button>` : ""}
                            </div>
                        </div>
                    </div>
                `;
            }).join("");
        } catch (error) {
            console.error(error);
        }
    }*/

    async function loadExchanges() {
    try {
        const response = await fetch("http://localhost:5000/api/exchange", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Errore nel recupero degli scambi");

        const exchanges = await response.json();

        // **Recuperiamo le figurine dell'utente per fare i controlli frontend**
        const albumResponse = await fetch("http://localhost:5000/api/album", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!albumResponse.ok) throw new Error("Errore nel recupero dell'album");
        const userAlbum = await albumResponse.json();

        const userFigurineIds = userAlbum.figurine.reduce((acc, f) => {
            acc[f.idMarvel] = f.count;
            return acc;
        }, {});

         // Decodifichiamo il token per ottenere l'ID dell'utente attuale
         const decodedToken = JSON.parse(atob(token.split('.')[1]));
         const userId = decodedToken.userId;

        exchangeList.innerHTML = exchanges.map(exchange => {
            const userIsOwner = exchange.offeredBy === userId; // Controlliamo se lo scambio è stato creato dall'utente

            if (exchange.status === "rejected") {
                return `
                    <div class="col-md-4">
                        <div class="card mt-3 bg-light">
                            <div class="card-body">
                                <p><strong>Offerto:</strong> ${exchange.offeredFigurina.name}</p>
                                <p><strong>Richiesto:</strong> ${exchange.requestedFigurina.name}</p>
                                <p class="text-danger">Questo scambio è stato rifiutato.</p>
                            </div>
                        </div>
                    </div>
                `;
            }

            const requestedFigurinaId = exchange.requestedFigurina.idMarvel;
            const offeredFigurinaId = exchange.offeredFigurina.idMarvel;

            // **Controlliamo se l'utente ha la figurina richiesta**
            const userHasRequestedFigurina = userFigurineIds[requestedFigurinaId] > 0;

            // **Controlliamo se l'utente ha già la figurina offerta**
            const userHasOfferedFigurina = userFigurineIds[offeredFigurinaId] > 0;

            return `
                <div class="col-md-4">
                    <div class="card mt-3">
                        <div class="card-body">
                            <p><strong>Offerto:</strong> ${exchange.offeredFigurina.name}</p>
                            <p><strong>Richiesto:</strong> ${exchange.requestedFigurina.name}</p>
                            ${userIsOwner ? `
                                <button class="btn btn-danger" onclick="withdrawExchange('${exchange._id}')">Ritira Scambio</button>
                            ` : `
                                <button class="btn btn-success accept-btn"
                                    onclick="attemptAcceptExchange('${exchange._id}', ${userHasOfferedFigurina})"
                                    ${!userHasRequestedFigurina ? "disabled" : ""}>
                                    Accetta Scambio
                                </button>
                                <button class="btn btn-secondary reject-btn"
                                    onclick="rejectExchange('${exchange._id}')"
                                    ${!userHasRequestedFigurina ? "disabled" : ""}>
                                    Rifiuta Scambio
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    } catch (error) {
        console.error(error);
    }}

    

    // **Accettare uno scambio**
    window.acceptExchange = async (exchangeId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/exchange/${exchangeId}/accept`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Errore nell'accettare lo scambio");

            showNotification("Scambio accettato!", "success");
            loadExchanges();

        } catch (error) {
            console.error(error);
            showNotification("Errore nell'accettare lo scambio!", "danger");
        }

    };

    window.rejectExchange = async (exchangeId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/exchange/${exchangeId}/reject`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                showNotification(data.error || "Errore nel rifiutare lo scambio", "danger");
                return;
            }
    
            showNotification("Scambio rifiutato con successo!", "success");
    
            // **Aggiorniamo la lista degli scambi**
            await loadExchanges();
    
        } catch (error) {
            console.error(error);
            showNotification("Errore nel rifiutare lo scambio", "danger");
        }
    };
    

    // **Ritirare uno scambio**
    window.withdrawExchange = async (exchangeId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "login.html";
            return;
        } 

        try {
            const response = await fetch(`http://localhost:5000/api/exchange/${exchangeId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Errore nel ritiro dello scambio");

            showNotification("Scambio ritirato con successo!", "success");
            loadExchanges();
        } catch (error) {
            console.error(error);
            showNotification("Errore nel ritiro dello scambio!", "danger");
        }

        setTimeout(() => { // è la soluzione migliore?
            location.reload();
        }, 50);
    };

    // Caricamento iniziale
    loadUserFigurine();
    loadExchanges();
});





