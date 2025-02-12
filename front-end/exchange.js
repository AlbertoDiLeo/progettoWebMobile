document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

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
            renderExchanges(exchanges);
        } catch (error) {
            console.error(error);
        }
    }

    function renderExchanges(exchanges) {
        const exchangeList = document.getElementById("exchangeList");
        const pendingExchanges = document.getElementById("pendingExchanges");
        const completedExchanges = document.getElementById("completedExchanges");

        exchangeList.innerHTML = "";
        pendingExchanges.innerHTML = "";
        completedExchanges.innerHTML = "";

        exchanges.forEach(exchange => {
            const exchangeCard = `
                <div class="col-md-4">
                    <div class="card mt-3">
                        <div class="card-body">
                            <p><strong>Offerto:</strong> ${exchange.offeredFigurina.name}</p>
                            <p><strong>Richiesto:</strong> ${exchange.requestedFigurina.name}</p>
                            ${exchange.status === "pending" ? `
                                <button class="btn btn-success" onclick="acceptExchange('${exchange._id}')">Accetta</button>
                                <button class="btn btn-danger" onclick="rejectExchange('${exchange._id}')">Rifiuta</button>
                            ` : `<p class="text-muted">Scambio ${exchange.status}</p>`}
                        </div>
                    </div>
                </div>
            `;

            if (exchange.status === "pending") {
                exchangeList.innerHTML += exchangeCard;
            } else if (exchange.status === "accepted" || exchange.status === "rejected") {
                completedExchanges.innerHTML += exchangeCard;
            }
        });
    }

    window.acceptExchange = async (exchangeId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/exchange/${exchangeId}/accept`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
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
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Errore nel rifiutare lo scambio");

            showNotification("Scambio rifiutato!", "danger");
            loadExchanges();
        } catch (error) {
            console.error(error);
            showNotification("Errore nel rifiutare lo scambio!", "danger");
        }
    };

    loadExchanges();
});