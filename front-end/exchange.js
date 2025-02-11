document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const exchangeForm = document.getElementById("exchangeForm");
    const offeredStickerSelect = document.getElementById("offeredSticker");
    const requestedStickerSelect = document.getElementById("requestedSticker");
    const exchangeList = document.getElementById("exchangeList");

    // **Caricare le figurine dell'utente per il form**
    async function loadUserStickers() {
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

            offeredStickerSelect.innerHTML = userAlbum.stickers
                .map(sticker => `<option value="${sticker._id}">${sticker.name}</option>`)
                .join("");

            requestedStickerSelect.innerHTML = userAlbum.stickers
                .map(sticker => `<option value="${sticker._id}">${sticker.name}</option>`)
                .join("");
        } catch (error) {
            console.error(error);
        }
    }

    // **Inviare una proposta di scambio**
    exchangeForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const offeredSticker = offeredStickerSelect.value;
        const requestedSticker = requestedStickerSelect.value;

        try {
            const response = await fetch("http://localhost:5000/api/exchange", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ offeredSticker, requestedSticker })
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
                            <p><strong>Offerto:</strong> ${exchange.offeredSticker.name}</p>
                            <p><strong>Richiesto:</strong> ${exchange.requestedSticker.name}</p>
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
    loadUserStickers();
    loadExchanges();
});
