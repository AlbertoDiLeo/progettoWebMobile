document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const exchangeForm = document.getElementById("exchangeForm");
    const exchangeTypeSelect = document.getElementById("exchangeType");
    const offeredFigurinaSelect = document.getElementById("offeredFigurine");
    const requestedFigurinaSelect = document.getElementById("requestedFigurine");
    const creditAmountContainer = document.getElementById("creditAmountContainer");
    const creditAmountInput = document.getElementById("creditAmount");
    const proposedExchanges = document.getElementById("proposedExchanges");

    // Mostra o nasconde il campo crediti
    exchangeTypeSelect.addEventListener("change", () => {
        if (exchangeTypeSelect.value === "crediti") {
            creditAmountContainer.style.display = "block";
            requestedFigurinaSelect.style.display = "none";
        } else {
            creditAmountContainer.style.display = "none";
            requestedFigurinaSelect.style.display = "block";
        }
    });

    async function loadUserFigurine() {
        try {
            const response = await fetch("http://localhost:5000/api/album", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Errore nel recupero dell'album");

            const userAlbum = await response.json();
            const doppioni = userAlbum.figurine.filter(f => f.count > 1);
            const mancanti = userAlbum.figurine.filter(f => !f.found);

            offeredFigurinaSelect.innerHTML = doppioni.map(f => `<option value="${f.idMarvel}">${f.name} x${f.count}</option>`).join("");
            requestedFigurinaSelect.innerHTML = mancanti.map(f => `<option value="${f.idMarvel}">${f.name}</option>`).join("");

        } catch (error) {
            console.error(error);
        }
    }

    exchangeForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const offeredFigurinaIds = Array.from(offeredFigurinaSelect.selectedOptions).map(opt => opt.value);
        const requestedFigurinaIds = Array.from(requestedFigurinaSelect.selectedOptions).map(opt => opt.value);
        const creditAmount = creditAmountInput.value;

        if (!offeredFigurinaIds.length || (exchangeTypeSelect.value !== "crediti" && !requestedFigurinaIds.length)) {
            showNotification("Seleziona almeno una figurina da offrire e una da richiedere!", "danger");
            return;
        }

        const exchangeData = {
            type: exchangeTypeSelect.value,
            offeredFigurinaIds,
            requestedFigurinaIds,
            creditAmount: exchangeTypeSelect.value === "crediti" ? creditAmount : null
        };

        try {
            const response = await fetch("http://localhost:5000/api/exchange", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(exchangeData)
            });

            if (!response.ok) throw new Error("Errore nella proposta di scambio");

            showNotification("Scambio proposto con successo!", "success");
            loadProposedExchanges();
        } catch (error) {
            console.error(error);
        }
    });

    async function loadProposedExchanges() {
        try {
            const response = await fetch("http://localhost:5000/api/exchange/proposed", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Errore nel recupero degli scambi proposti");

            const exchanges = await response.json();
            proposedExchanges.innerHTML = exchanges.map(e => `<p>${e.offeredFigurina.name} ➝ ${e.requestedFigurina.name} <button onclick="withdrawExchange('${e._id}')">Ritira</button></p>`).join("");
        } catch (error) {
            console.error(error);
        }
    }

    loadUserFigurine();
    loadProposedExchanges();
});
