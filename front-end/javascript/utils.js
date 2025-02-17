
function getToken() {
    return localStorage.getItem('token');
}

function removeToken() {
    localStorage.removeItem('token');
}

function setLocalStorage(chiave, valore){
    localStorage.setItem(chiave, valore);
}

function getLocalStorage(chiave){
    return JSON.parse(localStorage.getItem(chiave))
}

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
    }, 3000);
}


let debounceTimer; // Per evitare troppe chiamate API

async function checkUsernameAvailability(name) {
    clearTimeout(debounceTimer); // Reset del timer

    // Controlli iniziali per evitare chiamate inutili
    if (!name) {
        updateUsernameFeedback("", ""); // Reset messaggio se l'input è vuoto
        return;
    }
    if (name.length < 3) {
        updateUsernameFeedback("⚠️ Il nome deve essere di almeno 3 caratteri.", "warning");
        return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
        updateUsernameFeedback("❌ Il nome può contenere solo lettere e numeri.", "danger");
        return;
    }

    // Evita chiamate API se l'utente continua a digitare rapidamente (debounce di 500ms)
    debounceTimer = setTimeout(async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/user/check-username/${name}`);
            const data = await response.json();

            if (data.available) {
                updateUsernameFeedback("✅ Nome disponibile!", "success");
            } else {
                updateUsernameFeedback("❌ Nome già in uso! Scegline un altro.", "danger");
            }
        } catch (error) {
            console.error("Errore nel controllo del nome utente:", error);
            updateUsernameFeedback("⚠️ Errore nel controllo del nome. Riprova.", "danger");
        }
    }, 500); 
}


function updateUsernameFeedback(message, type) {
    const feedbackElement = document.getElementById("usernameFeedback");

    if (!feedbackElement) return; // Se non esiste l'elemento, esci

    feedbackElement.textContent = message;
    feedbackElement.className = ""; // Reset classi
    feedbackElement.classList.add("mt-1"); // Margine sopra

    if (type === "success") {
        feedbackElement.classList.add("text-success"); // Verde
    } else if (type === "danger") {
        feedbackElement.classList.add("text-danger"); // Rosso
    } else if (type === "warning") {
        feedbackElement.classList.add("text-warning"); // Giallo
    }
}







function checkPasswordStrength(password) {
    const feedbackElement = document.getElementById("passwordFeedback");

    if (!feedbackElement) return; // Se l'elemento non esiste, esci

    if (password.length < 3) {
        feedbackElement.textContent = ""; // Nessun feedback prima di 3 caratteri
        return;
    }

    let strength = 0;
    let suggestion = "";

    // Controlli progressivi
    if (/[A-Z]/.test(password)) {
        strength += 1;
    } else {
        suggestion = "Password debole. Aggiungi almeno una lettera maiuscola.";
    }

    if (/\d/.test(password)) {
        strength += 1;
    } else if (strength === 1) {
        suggestion = "Password debole. Aggiungi almeno un numero.";
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        strength += 1;
    } else if (strength === 2) {
        suggestion = "Password moderata. Aggiungi almeno un carattere speciale (!@#$%^&*).";
    }

    if (password.length >= 8) {
        strength += 1;
    } else if (strength === 3) {
        suggestion = "Password moderata. Usa almeno 8 caratteri.";
    }

    // Cambiamo il messaggio in base alla sicurezza della password
    feedbackElement.className = "form-text mt-1"; // Reset classi

    if (strength === 4) {
        feedbackElement.textContent = "✅ Password Sicura!";
        feedbackElement.classList.add("text-success"); 
    } else if (strength >= 2) {
        feedbackElement.textContent = suggestion;
        feedbackElement.classList.add("text-warning"); 
    } else {
        feedbackElement.textContent = suggestion;
        feedbackElement.classList.add("text-danger"); 
    }
}



function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash"); // Cambia l'icona
    } else {
        input.type = "password";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye"); // Ripristina l'icona originale
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("confirmLogout");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            // Rimuove il token di autenticazione
            localStorage.removeItem("token");

            // Reindirizza alla pagina di login dopo il logout
            window.location.href = "index.html";
        });
    }
});