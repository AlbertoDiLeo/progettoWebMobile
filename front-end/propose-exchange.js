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


const token = localStorage.getItem('token');
console.log(token);

let multiploOffertiSelect;
let multiploRichiestiSelect;
let multiploCreditiOffertiSelect;

// Avvia il caricamento delle select quando la pagina è pronta
// Funzione principale per popolare le select in base al tipo di scambio
function populateSelects(album, tipoScambio) {
    if (tipoScambio === 'doppioni') {
      populateDoppioniSelects(album);
    } else if (tipoScambio === 'multiplo') {
      populateMultiploSelects(album);
    } else if (tipoScambio === 'crediti') {
      populateCreditiSelect(album);
    }
}
  
  // Scambio di Doppioni (già fatto prima)
  function populateDoppioniSelects(album) {
    const doppioniSelect = document.getElementById('doppioneOfferto');
    const mancantiSelect = document.getElementById('doppioneRichiesto');
  
    const doppioni = album.figurine.filter(f => f.count > 1);
    const mancanti = album.figurine.filter(f => f.count === 0 || !f.found);
  
    // Pulisce e popola le select
    populateSelectOptions(doppioniSelect, doppioni, 'Seleziona un doppione');
    populateSelectOptions(mancantiSelect, mancanti, 'Seleziona una figurina mancante');
  }
  
  // Scambio Multiplo (Nuova parte)
  function populateMultiploSelects(album) {
    multiploOffertiSelect = document.getElementById('multiploOfferti');
    multiploRichiestiSelect = document.getElementById('multiploRichiesti');
  
    const doppioni = album.figurine.filter(f => f.count > 1);
    const tutteFigurine = album.figurine;
  
    // Pulisce e popola le select
    populateSelectOptions(multiploOffertiSelect, doppioni, 'Seleziona fino a 3 doppioni');
    populateSelectOptions(multiploRichiestiSelect, tutteFigurine, 'Seleziona fino a 3 figurine');
  
    // Aggiunge il filtro per evitare lo stesso ID
    multiploOffertiSelect.addEventListener('change', filterMultiploRichiesti);
    multiploRichiestiSelect.addEventListener('change', filterMultiploOfferti);
  }

  function populateCreditiSelect(album) {
    multiploCreditiOffertiSelect = document.getElementById('multiploCreditiOfferti');
    const doppioni = album.figurine.filter(f => f.count > 1);
    populateSelectOptions(multiploCreditiOffertiSelect, doppioni, 'Seleziona fino a 3 doppioni');
  }
  
  // Funzione comune per popolare una select
  function populateSelectOptions(selectElement, data, placeholder) {
    selectElement.innerHTML = `<option value=\"\">${placeholder}</option>`;
    data.forEach(fig => {
      const option = document.createElement('option');
      option.value = fig.idMarvel;
      option.textContent = fig.name;
      selectElement.appendChild(option);
    });
  }
  
  // Filtri per lo scambio multiplo
  function filterMultiploRichiesti() {
    const offerti = Array.from(multiploOffertiSelect.selectedOptions).map(opt => opt.value);
    Array.from(multiploRichiestiSelect.options).forEach(option => {
      option.disabled = offerti.includes(option.value);
    });
  }
  
  function filterMultiploOfferti() {
    const richiesti = Array.from(multiploRichiestiSelect.selectedOptions).map(opt => opt.value);
    Array.from(multiploOffertiSelect.options).forEach(option => {
      option.disabled = richiesti.includes(option.value);
    });
  }
  
  // Esegue tutto al caricamento della pagina
  async function loadAlbumAndPopulate() {
    try {
      const response = await fetch('http://localhost:3000/api/album', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.figurine) {
        const tipoScambio = document.getElementById('exchangeType').value;
        populateSelects(data, tipoScambio);
      } else {
        console.error('Errore nel recupero delle figurine:', data.message);
      }
    } catch (error) {
      console.error('Errore nella fetch dell\'album:', error);
    }
  }
  
  // Cambia automaticamente le select al cambio della select principale
  document.getElementById('exchangeType').addEventListener('change', loadAlbumAndPopulate);
  
  // Avvia il caricamento iniziale
  document.addEventListener('DOMContentLoaded', loadAlbumAndPopulate);


  // Modifica la funzione per creare lo scambio con il controllo
async function createExchange() {
    const tipoScambio = document.getElementById('exchangeType').value;
    if (!validateSelections(tipoScambio)) return;
  
    let payload = { type: tipoScambio };
  
    if (tipoScambio === 'doppioni') {
      payload.offeredFigurines = [document.getElementById('doppioneOfferto').value];
      payload.requestedFigurines = [document.getElementById('doppioneRichiesto').value];
    } else if (tipoScambio === 'multiplo') {
      payload.offeredFigurines = Array.from(document.getElementById('multiploOfferti').selectedOptions).map(opt => opt.value);
      payload.requestedFigurines = Array.from(document.getElementById('multiploRichiesti').selectedOptions).map(opt => opt.value);
    } else if (tipoScambio === 'crediti') {
      payload.offeredFigurines = Array.from(document.getElementById('creditiOfferti').selectedOptions).map(opt => opt.value);
      payload.creditAmount = document.getElementById('creditiRichiesti').value;
    }
  
    try {
      const response = await fetch('http://localhost:3000/api/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      if (response.ok) {
        showNotifcation('Scambio creato con successo!', 'success');
        loadAlbumAndPopulate();
      } else {
        showNotifcation(`Errore: ${result.message}`, 'danger');
      }
    } catch (error) {
      console.error('Errore nella creazione dello scambio:', error);
      showNotifcation('Errore interno del server', 'danger');
    }
  }
  
  document.getElementById('confirmExchangeButton').addEventListener('click', createExchange);
  
  
  function validateSelections(tipoScambio) {
    const checkLimit = (select, limit) => select.selectedOptions.length <= limit;
  
    if (tipoScambio === 'doppioni') {
      if (!checkLimit(document.getElementById('doppioneOfferto'), 1) ||
          !checkLimit(document.getElementById('doppioneRichiesto'), 1)) {
          showNotifcation('Puoi selezionare solo una figurina per lo scambio di doppioni.', 'danger');
        return false;
      }
    } else if (tipoScambio === 'multiplo' || tipoScambio === 'crediti') {
      const multiploOfferti = document.getElementById('multiploOfferti');
      const multiploRichiesti = document.getElementById('multiploRichiesti');
      const creditiOfferti = document.getElementById('creditiOfferti');
  
      if ((multiploOfferti && !checkLimit(multiploOfferti, 3)) ||
          (multiploRichiesti && !checkLimit(multiploRichiesti, 3)) ||
          (creditiOfferti && !checkLimit(creditiOfferti, 3))) {
        showNotifcation('Puoi selezionare al massimo 3 figurine.', 'danger');
        return false;
      }
    }
    return true;
  }


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




