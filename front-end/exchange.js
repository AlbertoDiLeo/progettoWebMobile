/*document.addEventListener("DOMContentLoaded", async () => {
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
        exchangeList.innerHTML = "";
    
        exchanges.forEach(exchange => {
            const offeredFigurinesHTML = exchange.offeredFigurines.map(f => 
                `<img src="${f.image}" alt="${f.name}" title="${f.name}" class="figurina-img">`
            ).join(" ");
    
            const requestedFigurinesHTML = exchange.requestedFigurines.map(f => 
                `<img src="${f.image}" alt="${f.name}" title="${f.name}" class="figurina-img">`
            ).join(" ");
    
            exchangeList.innerHTML += `
                <div class="exchange-card">
                    <p><strong>Offerto da:</strong> ${exchange.offeredBy.username}</p>
                    <p><strong>Offerto:</strong> ${offeredFigurinesHTML}</p>
                    <p><strong>Richiesto:</strong> ${exchange.type === "crediti" ? exchange.creditAmount + " Crediti" : requestedFigurinesHTML}</p>
                    <button class="btn btn-success" onclick="acceptExchange('${exchange._id}')">Accetta</button>
                    <button class="btn btn-danger" onclick="rejectExchange('${exchange._id}')">Rifiuta</button>
                </div>
            `;
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
});*/

//document.addEventListener("DOMContentLoaded", async () => {
    /*const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    // Recupera gli scambi disponibili per l'utente
    async function loadExchanges() {
        const response = await fetch('http://localhost:5000/api/exchange', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const exchanges = await response.json();
        const exchangeList = document.getElementById('exchangeList');
        const pendingList = document.getElementById('pendingExchanges');
        const completedList = document.getElementById('completedExchanges');

        exchangeList.innerHTML = '';
        pendingList.innerHTML = '';
        completedList.innerHTML = '';

        exchanges.forEach(exchange => {
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
                        ${exchange.status === 'pending' && exchange.offeredBy !== userId ? `
                            <button class="btn btn-success btn-sm" onclick="acceptExchange('${exchange._id}')">Accetta</button>
                            <button class="btn btn-danger btn-sm" onclick="rejectExchange('${exchange._id}')">Rifiuta</button>
                        ` : ''}
                    </div>
                </div>
            `;
            
            if (exchange.status === 'pending') {
                exchangeList.appendChild(card);
            } else if (exchange.status === 'accepted') {
                completedList.appendChild(card);
            } else {
                pendingList.appendChild(card);
            }
        });
    }

    // Accetta uno scambio
    async function acceptExchange(exchangeId) {
        const response = await fetch(`http://localhost:5000/api/exchange/${exchangeId}/accept`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
            alert('Scambio accettato con successo!');
            loadExchanges();
        } else {
            alert('Errore durante l\'accettazione dello scambio.');
        }
    }

    // Rifiuta uno scambio
    async function rejectExchange(exchangeId) {
        const response = await fetch(`http://localhost:5000/api/exchange/${exchangeId}/reject`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
            alert('Scambio rifiutato.');
            loadExchanges();
        } else {
            alert('Errore durante il rifiuto dello scambio.');
        }
    }

    document.addEventListener('DOMContentLoaded', loadExchanges);

//});*/




document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
  
    async function fetchDoppioniExchanges() {
      try {
        const response = await fetch('http://localhost:3000/api/exchange/available', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) populateExchanges(data.exchanges, 'doppioniExchanges');
        else console.error('Errore:', data.message);
      } catch (error) { console.error('Errore nel recupero degli scambi:', error); }
    }
  
    async function fetchMultiploExchanges() {
      try {
        const response = await fetch('http://localhost:3000/api/exchange/available/multiplo', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) populateExchanges(data.exchanges, 'multiploExchanges');
        else console.error('Errore:', data.message);
      } catch (error) { console.error('Errore nel recupero degli scambi multipli:', error); }
    }

    async function fetchCreditiExchanges() {
        try {
          const response = await fetch('http://localhost:3000/api/exchange/available/crediti', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok) populateExchanges(data.exchanges, 'creditiExchanges');
          else console.error('Errore:', data.message);
        } catch (error) { console.error('Errore nel recupero degli scambi per crediti:', error); }
    }
  
    function populateExchanges(exchanges, containerId) {
      const container = document.getElementById(containerId);
      container.innerHTML = '';
      exchanges.forEach(exchange => {
        const card = document.createElement('div');
        card.className = 'card p-3';
        card.innerHTML = `
          <h5>Offro: ${exchange.offeredFigurines.map(f => f.name).join(', ')}</h5>
          <p>Richiedo: ${exchange.requestedFigurines.map(f => f.name).join(', ')}</p>
          <button class="btn btn-success me-2">Accetta</button>
          <button class="btn btn-danger">Rifiuta</button>
        `;
        container.appendChild(card);
      });
    }
  
    const select = document.getElementById('exchangeTypeSelect');
    select.addEventListener('change', () => {
        document.getElementById('doppioniSection').classList.add('d-none');
        document.getElementById('multiploSection').classList.add('d-none');
        document.getElementById('creditiSection').classList.add('d-none');
  
        if (select.value === 'doppioni') fetchDoppioniExchanges();
        else if (select.value === 'multiplo') fetchMultiploExchanges();
        else if (select.value === 'crediti') fetchCreditiExchanges();
    });
  
    fetchDoppioniExchanges();
  });
  
  
