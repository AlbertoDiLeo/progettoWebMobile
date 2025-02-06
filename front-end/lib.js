
function getToken() {
    return localStorage.getItem('token');
}

function removeToken() {
    localStorage.removeItem('token');
}

//function setLocalStorage(chiave, valore){
    //  localStorage.setItem(chiave, JSON.stringify(valore))
//}

function setLocalStorage(chiave, valore){
    localStorage.setItem(chiave, valore);
}



function getLocalStorage(chiave){
    return JSON.parse(localStorage.getItem(chiave))
}




/*function showNotification(message, type = 'success') {
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
}*/

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');

    // Se l'elemento non esiste, esci dalla funzione
    if (!notification) return;

    // Se è la prima volta che viene chiamata, svuota e prepara il contenitore
    if (!notification.dataset.initialized) {
        notification.innerHTML = "<ul class='mb-0'></ul>";
        notification.dataset.initialized = "true";
    }

    // Rimuove le classi precedenti e imposta il tipo di alert
    notification.className = 'alert alert-dismissible fade show';
    notification.classList.add(type === 'success' ? 'alert-success' : 'alert-danger');

    // Recupera la lista UL e aggiunge il nuovo messaggio
    const messageList = notification.querySelector("ul");
    const newMessage = document.createElement("li");
    newMessage.textContent = message;
    messageList.appendChild(newMessage);

    // Mostra l'alert
    notification.classList.remove('d-none');

    // Resetta il timer per nascondere la notifica dopo 5 secondi
    clearTimeout(notification.hideTimeout);
    notification.hideTimeout = setTimeout(() => {
        notification.classList.add('d-none');
        notification.dataset.initialized = ""; // Reset per la prossima volta
    }, 5000);
}




