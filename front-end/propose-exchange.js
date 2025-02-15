

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
  
  // Scambio di Doppioni 
  function populateDoppioniSelects(album) {
    const doppioniSelect = document.getElementById('doppioneOfferto');
    const mancantiSelect = document.getElementById('doppioneRichiesto');
  
    const doppioni = album.figurine.filter(f => f.count > 1);
    const mancanti = album.figurine.filter(f => f.count === 0 || !f.found);
  
    // Pulisce e popola le select
    populateSelectOptions(doppioniSelect, doppioni, 'Seleziona un doppione');
    populateSelectOptions(mancantiSelect, mancanti, 'Seleziona una figurina mancante');
  }
  
  // Scambio Multiplo 
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
      if (`${fig.count}` > 0) {
        option.textContent = `${fig.name} x${fig.count}`;
      } else {
        option.textContent = fig.name;
      }
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
        data.figurine.sort((a, b) => a.name.localeCompare(b.name));
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
  
    // Helper per ottenere { idMarvel, name }
    const getFigurinaData = (select) => {
      if (!select) return [];
      return Array.from(select.selectedOptions).map(opt => ({
        idMarvel: opt.value,
        name: opt.textContent.replace(/ x\d+$/, '') // Prende il nome dalla select e rimuove il contatore dal nome  
      }));
    };
  
    let payload = { type: tipoScambio };
  
    if (tipoScambio === 'doppioni') {
      payload.offeredFigurines = getFigurinaData(document.getElementById('doppioneOfferto'));
      payload.requestedFigurines = getFigurinaData(document.getElementById('doppioneRichiesto'));
    } else if (tipoScambio === 'multiplo') {
      payload.offeredFigurines = getFigurinaData(document.getElementById('multiploOfferti'));
      payload.requestedFigurines = getFigurinaData(document.getElementById('multiploRichiesti'));
    } else if (tipoScambio === 'crediti') {
      payload.offeredFigurines = getFigurinaData(document.getElementById('multiploCreditiOfferti'));
      //payload.creditAmount = document.getElementById('creditiRichiesti').value;
      const creditInput = document.getElementById('creditiRichiesti');
      payload.creditAmount = creditInput ? creditInput.value : 0;
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
        showNotification('Scambio creato con successo!', 'success');
        loadProposedExchanges(); // Aggiorna la lista
        /*setTimeout(() => {
          location.reload(); // Ricarica la pagina per resettare i campi
        }, 2000);*/ // Ricarica la pagina per resettare i campi
      } else {
        showNotification(`Errore: ${result.message}`, 'danger');
      }
    } catch (error) {
      console.error('Errore nella creazione dello scambio:', error);
      showNotification('Errore durante la creazione dello scambio.', 'danger');
    }
  }
  
  
  document.getElementById('confirmExchangeButton').addEventListener('click', createExchange);
  
  
  function validateSelections(tipoScambio) {
    const checkLimit = (select, limit) => select.selectedOptions.length <= limit;
  
    if (tipoScambio === 'doppioni') {
      if (!checkLimit(document.getElementById('doppioneOfferto'), 1) ||
          !checkLimit(document.getElementById('doppioneRichiesto'), 1)) {
          showNotification('Puoi selezionare solo una figurina per lo scambio di doppioni.', 'danger');
        return false;
      }
    } else if (tipoScambio === 'multiplo' || tipoScambio === 'crediti') {
      const multiploOfferti = document.getElementById('multiploOfferti');
      const multiploRichiesti = document.getElementById('multiploRichiesti');
      const multiploCreditiOfferti = document.getElementById('multiploCreditiOfferti');
  
      if ((multiploOfferti && !checkLimit(multiploOfferti, 3)) ||
          (multiploRichiesti && !checkLimit(multiploRichiesti, 3)) ||
          (multiploCreditiOfferti && !checkLimit(multiploCreditiOfferti, 3))) {
          showNotification('Puoi selezionare al massimo 3 figurine.', 'danger');
        return false;
      }
    }
    return true;
}

// Recupera e mostra gli scambi proposti
async function loadProposedExchanges() {
    try {
      const response = await fetch('http://localhost:3000/api/exchange/mine', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const exchanges = await response.json();
  
      const container = document.getElementById('proposedExchanges');
      container.innerHTML = ''; // Pulisce il contenitore
  
      exchanges.forEach(exchange => {
        const template = document.getElementById('exchangeCardTemplate');
        const clone = template.cloneNode(true);
        clone.classList.remove('d-none');
        clone.querySelector('#exchangeDescription').textContent = 
          formatExchangeDescription(exchange);
        clone.querySelector('#withdrawButton').addEventListener('click', () => 
          withdrawExchange(exchange._id, clone)
        );
        container.appendChild(clone);
      });
    } catch (error) {
      console.error('Errore nel recupero degli scambi proposti:', error);
    }
}
  
  // Formatta la descrizione dello scambio
/*function formatExchangeDescription(exchange) {
  const offerti = exchange.offeredFigurines.map(f => f.name.replace(/ x\d+$/, '')).join(', ');
  const richiesti = exchange.requestedFigurines?.length 
      ? exchange.requestedFigurines.map(f => f.name.replace(/ x\d+$/, '')).join(', ') 
      : `${exchange.creditAmount} crediti`;
  return `Ti offro: ${offerti} per ${richiesti}`;
}*/

function formatExchangeDescription(exchange) {
  let offerti;
  if (exchange.type === 'crediti') {
    offerti = exchange.offeredFigurines.map(f => f.name).join(', ');
  } else {
    offerti = exchange.offeredFigurines.map(f => f.name.replace(/ x\d+$/, '')).join(', ');
  }

  const richiesti = exchange.type === 'crediti' 
      ? `${exchange.creditAmount} crediti`
      : exchange.requestedFigurines.map(f => f.name.replace(/ x\d+$/, '')).join(', ');

  return `Ti offro: ${offerti} per ${richiesti}`;
}


// Funzione per ritirare uno scambio
async function withdrawExchange(exchangeId, cardElement) {
    try {
      const response = await fetch(`http://localhost:3000/api/exchange/${exchangeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
  
      const result = await response.json();
      if (response.ok) {
        showNotification('Scambio ritirato con successo!', 'success');
        //location.reload(); // Ricarica la pagina per aggiornare la lista
        cardElement.remove(); // Rimuove la card dall'interfaccia
      } else {
        showNotification(`Errore: ${result.message}`, 'danger');
      }
    } catch (error) {
      console.error('Errore nel ritiro dello scambio:', error);
      showNotification('Errore durante il ritiro dello scambio.', 'danger');
    }
}
  
  // Carica automaticamente gli scambi al caricamento della pagina
document.addEventListener('DOMContentLoaded', loadProposedExchanges);
  
  


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




