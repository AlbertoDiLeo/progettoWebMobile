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
            const doppioni = userAlbum.figurine.filter(figurina => figurina.count > 1);
            
            // **Figurine mancanti (da richiedere)**
            const mancanti = userAlbum.figurine.filter(figurina => !figurina.found);
    
            // Popoliamo i menu a tendina con gli **id**, ma mostriamo il nome
            offeredFigurinaSelect.innerHTML = doppioni.length > 0 
            ? doppioni.map(figurina => `<option value="${figurina.idMarvel}" data-name="${figurina.name}">${figurina.name} (x${figurina.count})</option>`).join("")
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

        console.log("🔹 Proposta di scambio:", offeredFigurinaId, requestedFigurinaId);

       // **Validazione: assicurarsi che entrambi i campi siano selezionati**
        if (!offeredFigurinaId || !requestedFigurinaId) {
            showNotification("Seleziona sia una figurina da offrire che una da richiedere!", "danger");
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

            showNotification("Scambio proposto con successo!", "success");
            loadExchanges();
        } catch (error) {
            console.error(error);
        }
    });

    // **Caricare gli scambi disponibili**
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

            exchangeList.innerHTML = exchanges.map(exchange => `
                <div class="col-md-4">
                    <div class="card mt-3">
                        <div class="card-body">
                            <p><strong>Offerto:</strong> ${exchange.offeredFigurina.name}</p>
                            <p><strong>Richiesto:</strong> ${exchange.requestedFigurina.name}</p>
                            <button class="btn btn-success" onclick="acceptExchange('${exchange._id}')">Accetta Scambio</button>
                        </div>
                    </div>
                </div>
            `).join("");
        } catch (error) {
            console.error(error);
        }
    }

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

            alert("Scambio accettato!");
            loadExchanges();
        } catch (error) {
            console.error(error);
        }
    };

    // Caricamento iniziale
    loadUserFigurine();
    loadExchanges();
});
