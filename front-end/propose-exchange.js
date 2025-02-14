/*document.addEventListener("DOMContentLoaded", async () => {
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
            alert("Seleziona almeno una figurina da offrire e una da richiedere!"); 
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/exchange", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    offeredFigurineIds: offeredFigurinaIds,
                    requestedFigurineIds: requestedFigurinaIds,
                    creditAmount: creditAmount,
                    type: exchangeTypeSelect.value
                })
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
            const response = await fetch("http://localhost:5000/api/exchange", {
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
});*/

//document.addEventListener("DOMContentLoaded", async () => {

/*    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    // Carica le figurine dell'utente per selezionare cosa offrire
    async function loadUserFigurines() {
        const response = await fetch(`http://localhost:5000/api/album/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const album = await response.json();
        
        const offeredSelect = document.getElementById('offeredFigurine');
        const requestedSelect = document.getElementById('requestedFigurine');
        
        offeredSelect.innerHTML = '';
        requestedSelect.innerHTML = '';
        
        album.figurine.forEach(figurina => {
            const option = `<option value="${figurina._id}">${figurina.name}</option>`;
            offeredSelect.innerHTML += option;
            requestedSelect.innerHTML += option;
        });
    }

    // Gestisce il cambio di tipo di scambio (doppioni, multiplo, crediti)
    document.getElementById('exchangeType').addEventListener('change', (e) => {
        const type = e.target.value;
        const creditAmountContainer = document.getElementById('creditAmountContainer');
        if (type === 'crediti') {
            creditAmountContainer.style.display = 'block';
        } else {
            creditAmountContainer.style.display = 'none';
        }
    });

    // Proponi uno scambio
    document.getElementById('exchangeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = document.getElementById('exchangeType').value;
        const offered = Array.from(document.getElementById('offeredFigurine').selectedOptions).map(opt => opt.value);
        const requested = Array.from(document.getElementById('requestedFigurine').selectedOptions).map(opt => opt.value);
        const creditAmount = document.getElementById('creditAmount').value;

        const exchangeData = {
            offeredBy: userId,
            type,
            offeredFigurines: offered,
            requestedFigurines: type !== 'crediti' ? requested : [],
            creditAmount: type === 'crediti' ? parseInt(creditAmount) : 0,
        };

        const response = await fetch('http://localhost:5000/api/exchange', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(exchangeData),
        });

        if (response.ok) {
            alert('Scambio proposto con successo!');
            loadProposedExchanges();
        } else {
            alert('Errore durante la proposta di scambio.');
        }
    });

    // Carica gli scambi proposti dall'utente
    async function loadProposedExchanges() {
        const response = await fetch('http://localhost:5000/api/exchange', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const exchanges = await response.json();
        const proposedList = document.getElementById('proposedExchanges');

        proposedList.innerHTML = '';

        exchanges
            .filter(ex => ex.offeredBy === userId)
            .forEach(exchange => {
                const card = document.createElement('div');
                card.classList.add('col-md-4', 'mb-3');
                card.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Tipo: ${exchange.type}</h5>
                            <p class="card-text">Offerte: ${exchange.offeredFigurines.map(f => f.name).join(', ')}</p>
                            <p class="card-text">Richieste: ${
                                exchange.type === 'crediti' ? 
                                `${exchange.creditAmount} crediti` : 
                                exchange.requestedFigurines.map(f => f.name).join(', ')
                            }</p>
                            <p class="card-text">Stato: ${exchange.status}</p>
                            <button class="btn btn-danger btn-sm" onclick="withdrawExchange('${exchange._id}')">Ritira Scambio</button>
                        </div>
                    </div>
                `;
                proposedList.appendChild(card);
            });
    }

    // Ritira uno scambio proposto
    async function withdrawExchange(exchangeId) {
        const response = await fetch(`http://localhost:5000/api/exchange/${exchangeId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
            alert('Scambio ritirato con successo.');
            loadProposedExchanges();
        } else {
            alert('Errore durante il ritiro dello scambio.');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadUserFigurines();
        loadProposedExchanges();
    });

//});*/


  


function showForm() {
    const selected = document.getElementById('exchangeType').value;
    document.getElementById('formDoppioni').classList.add('d-none');
    document.getElementById('formMultiplo').classList.add('d-none');
    document.getElementById('formCrediti').classList.add('d-none');
    
    if (selected === 'doppioni') {
      document.getElementById('formDoppioni').classList.remove('d-none');
    } else if (selected === 'multiplo') {
      document.getElementById('formMultiplo').classList.remove('d-none');
    } else if (selected === 'crediti') {
      document.getElementById('formCrediti').classList.remove('d-none');
    }
}




