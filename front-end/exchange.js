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

            // Verifica che userAlbum esista e abbia un array figurine
            if (!userAlbum || !userAlbum.figurine || !Array.isArray(userAlbum.figurine)) {
                console.error("Nessuna figurina trovata o formato non valido!");
                return;
            }
            
            offeredFigurinaSelect.innerHTML = userAlbum.figurine
                .map(figurina => `<option value="${figurina._id}">${figurina.name}</option>`)
                .join("");

            requestedFigurinaSelect.innerHTML = userAlbum.figurine
                .map(figurina => `<option value="${figurina._id}">${figurina.name}</option>`)
                .join("");
        } catch (error) {
            console.error(error);
        }
    }

    // **Inviare una proposta di scambio**
    exchangeForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const offeredFigurina = offeredFigurinaSelect.value;
        const requestedFigurina = requestedFigurinaSelect.value;

        try {
            const response = await fetch("http://localhost:5000/api/exchange", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ offeredFigurina, requestedFigurina })
            });

            if (!response.ok) throw new Error("Errore nella proposta di scambio");

            alert("Scambio proposto con successo!");
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
