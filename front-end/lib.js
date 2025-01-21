
function getToken() {
    return localStorage.getItem('token');
}

function removeToken() {
    localStorage.removeItem('token');
}

function setLocalStorage(chiave, valore){
    localStorage.setItem(chiave, JSON.stringify(valore))
}


function getLocalStorage(chiave){
    return JSON.parse(localStorage.getItem(chiave))
}




function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');

    // Rimuove le classi precedenti
    notification.className = 'alert';

    // Aggiunge la classe per il tipo di alert
    if (type === 'success') {
        notification.classList.add('alert-success'); // Stile verde per i successi
    } else {
        notification.classList.add('alert-danger'); // Stile rosso per gli errori
    }

    // Mostra l'alert con il messaggio
    notification.classList.remove('d-none');
    notification.textContent = message;

    // Nasconde l'alert dopo 5 secondi
    setTimeout(() => {
        notification.classList.add('d-none');
    }, 5000);
}




