

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    //console.log('Token:', token);
  
    async function fetchExchanges(url, containerId) {
      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        console.log('Risposta ricevuta:', data);
        if (response.ok) {
          populateExchanges(data.exchanges, containerId);
        } else {
          console.error('Errore:', data.message);
        }
      } catch (error) {
        console.error('Errore nel recupero degli scambi:', error);
      }
    }
  
    function populateExchanges(exchanges, containerId) {
      const container = document.getElementById(containerId);
      container.innerHTML = '';
      const template = document.querySelector('.card-template');
      console.log(containerId);
      if (exchanges.length === 0) {
        showNoExchangesMessage(document.getElementById(containerId), 'Nessuno scambio al momento');
        return;
      }    
  
      exchanges.forEach(exchange => {
        const cardClone = template.cloneNode(true);
        // Rimuove temporaneamente d-none
        cardClone.classList.remove('d-none');
  
        cardClone.querySelector('.offered').textContent = `Mi viene offerto: ${exchange.offeredFigurines.map(f => f.name).join(', ')}`;
        cardClone.querySelector('.requested').textContent = `Perdo: ${exchange.requestedFigurines.map(f => f.name).join(', ') || exchange.creditAmount + ' crediti'}`;
        //cardClone.querySelector('.user').textContent = `Proposto da: ${exchange.offerBy.name}`;

        const acceptBtn = cardClone.querySelector('.accept-btn');
        const rejectBtn = cardClone.querySelector('.reject-btn');
        acceptBtn.addEventListener('click', () => handleAccept(exchange._id));
        rejectBtn.addEventListener('click', () => handleReject(exchange._id));
  
        container.appendChild(cardClone);
      });
    }
  
    async function handleAccept(exchangeId) {
        try {
            const response = await fetch(`http://localhost:3000/api/exchange/${exchangeId}/accept`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Risposta ricevuta:', response);
            const result = await response.json();
            console.log('Risultato JSON:', result);
            if (response.ok) {
              alert('Scambio accettato con successo!');
              location.reload();
            } else {
              alert(`Errore: ${result.message}`);
            }
        } catch (error) {
            console.error('Errore nell accettare lo scambio:', error);
            alert('Errore durante l accettazione dello scambio.');
        }
    }

    async function handleReject(exchangeId) {
        try {
            const response = await fetch(`http://localhost:3000/api/exchange/${exchangeId}/reject`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json();
            if (response.ok) {
                alert('Scambio rifiutato con successo!');
                location.reload();
            } else {
                alert(`Errore: ${result.message}`);
            }
        } catch (error) {
            console.error('Errore nel rifiutare lo scambio:', error);
            alert('Errore durante il rifiuto dello scambio.');
        }
    }
  
    const select = document.getElementById('exchangeTypeSelect');
    select.addEventListener('change', () => {
      document.getElementById('doppioniSection').classList.add('d-none');
      document.getElementById('multiploSection').classList.add('d-none');
      document.getElementById('creditiSection').classList.add('d-none');

      if (select.value === 'doppioni') {
          document.getElementById('doppioniSection').classList.remove('d-none');
          fetchExchanges('http://localhost:3000/api/exchange/available', 'doppioniExchanges');
      } else if (select.value === 'multiplo') {
          document.getElementById('multiploSection').classList.remove('d-none');
          fetchExchanges('http://localhost:3000/api/exchange/available/multiplo', 'multiploExchanges');
      } else if (select.value === 'crediti') {
          document.getElementById('creditiSection').classList.remove('d-none');
          fetchExchanges('http://localhost:3000/api/exchange/available/crediti', 'creditiExchanges');
      }
    });
  
    select.dispatchEvent(new Event('change'));
  });

  function loadAvailableExchanges() {
    fetch('http://localhost:3000/api/exchange/available', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('doppioniExchanges');
        console.log('Exchanges ricevuti:', data);
        console.log('Container:', container);
        container.innerHTML = '';
        data.exchanges.forEach(exchange => {
            const template = document.querySelector('.card-template');
            const cardClone = template.cloneNode(true);
            cardClone.classList.remove('d-none');
            cardClone.querySelector('.offered').textContent = `Mi viene offerto: ${exchange.offeredFigurines.map(f => f.name).join(', ')}`;
            cardClone.querySelector('.requested').textContent = `Perdo: ${exchange.requestedFigurines.map(f => f.name).join(', ')}`;
            container.appendChild(cardClone);
        });
    })
    .catch(error => console.error('Errore nel caricamento degli scambi disponibili:', error));
  }

  document.addEventListener('DOMContentLoaded', loadAvailableExchanges);

  
  async function loadRejectedExchanges() {
    try {
      const response = await fetch('http://localhost:3000/api/exchange/mine', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (response.ok) {
        const rejectedExchanges = data.filter(ex => ex.status === 'rejected');
        if (rejectedExchanges.length === 0) {
          showNoExchangesMessage(document.getElementById('rejectedMessage'), 'Nessun tuo scambio è stato rifiutato al momento');
          return;
        }        
        const container = document.getElementById('rejectedExchanges');
        container.innerHTML = '';
        rejectedExchanges.forEach(exchange => {
          const template = document.querySelector('.card-template-rejected');
          const cardClone = template.cloneNode(true);
          cardClone.classList.remove('d-none');
          cardClone.querySelector('.offered-text').textContent = `Ho offerto: ${exchange.offeredFigurines.map(f => f.name).join(', ')}`;
          cardClone.querySelector('.requested-text').textContent = `Per: ${exchange.requestedFigurines.length ? exchange.requestedFigurines.map(f => f.name).join(', ') : `${exchange.creditAmount} crediti`}`;
          
          const withdrawBtn = cardClone.querySelector('.withdraw-btn');
          withdrawBtn.addEventListener('click', () => withdrawExchange(exchange._id));
          
          container.appendChild(cardClone);
        });
      } else {
        console.error('Errore:', data.message);
      }
    } catch (error) {
      console.error('Errore nel caricamento degli scambi rifiutati:', error);
    }
  }
  
  async function withdrawExchange(exchangeId) {
    try {
      const response = await fetch(`http://localhost:3000/api/exchange/${exchangeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        loadRejectedExchanges(); // Ricarica gli scambi
      } else {
        alert(`Errore: ${result.message}`);
      }
    } catch (error) {
      console.error('Errore nel ritiro dello scambio:', error);
    }
  }
  
  document.addEventListener('DOMContentLoaded', loadRejectedExchanges);
  



  function loadAcceptedExchanges() {
    fetch('http://localhost:3000/api/exchange/mine', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => response.json())
    .then(data => {
        const acceptedExchanges = data.filter(ex => ex.status === 'accepted');
        if (acceptedExchanges.length === 0) {
          showNoExchangesMessage(document.getElementById('acceptedMessage'), 'Nessun tuo scambio è stato accettato al momento');
          return;
        }
        const container = document.getElementById('acceptedExchanges');
        container.innerHTML = '';

        acceptedExchanges.forEach(exchange => {
            const template = document.querySelector('.card-template-accepted');
            const cardClone = template.cloneNode(true);
            cardClone.classList.remove('d-none');
            cardClone.querySelector('.accepted-offered').textContent = `Ho ceduto: ${exchange.requestedFigurines.map(f => f.name).join(', ')}`;
            cardClone.querySelector('.accepted-received').textContent = `Ho acquistato: ${exchange.offeredFigurines.map(f => f.name).join(', ') || exchange.creditAmount + ' crediti'}`;
            
            // Aggiunto bottone cancella
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-secondary', 'mt-2');
            deleteBtn.textContent = 'Cancella';
            deleteBtn.addEventListener('click', () => cardClone.remove());

            cardClone.appendChild(deleteBtn);
            container.appendChild(cardClone);
        });
    })
    .catch(error => console.error('Errore nel caricamento degli scambi accettati:', error));
}

document.addEventListener('DOMContentLoaded', loadAcceptedExchanges);


document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('[data-bs-toggle="tab"]');
  tabs.forEach(tab => {
      tab.addEventListener('click', () => {
          document.getElementById('doppioniSection').classList.add('d-none');
          document.getElementById('multiploSection').classList.add('d-none');
          document.getElementById('creditiSection').classList.add('d-none');
          // Carica dinamicamente gli scambi in base alla tab selezionata
          if(tab.id === 'available-tab') loadAvailableExchanges();
          if(tab.id === 'rejected-tab') loadRejectedExchanges();
          if(tab.id === 'accepted-tab') loadAcceptedExchanges();
      });
  });
});


/*function showNoExchangesMessage(container, message) {
  if (!container) return; 
  container.textContent = message;
  container.classList.remove('d-none'); 
  container.classList.add('text-center', 'text-muted', 'mt-3');
}*/

function showNoExchangesMessage(container, message) {
  if (!container) return;
  container.innerHTML = '';
  const msg = document.createElement('p');
  msg.textContent = message;
  container.classList.remove('d-none'); 
  msg.classList.add('no-exchanges-message');
  container.appendChild(msg);
}
