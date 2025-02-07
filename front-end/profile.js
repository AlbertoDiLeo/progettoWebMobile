

document.addEventListener("DOMContentLoaded", async () => {
    const nameDisplay = document.getElementById("nameDisplay");
    const emailDisplay = document.getElementById("emailDisplay");
    const favoriteHeroDisplay = document.getElementById("favoriteHeroDisplay");
    //console.log(nameDisplay);

    try {
        const token = getToken(); // Recupera il token
        //console.log("Token recuperato da localStorage:", token); // Log del token

        const response = await fetch("http://localhost:5000/api/user/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Invia il token al server
            },
        });

        //console.log("Risposta HTTP:", response); // Log della risposta HTTP

        if (!response.ok) {
            const error = await response.json();
            console.error("Errore API:", error.message); // Log dell'errore API
            throw new Error("Errore nella richiesta del profilo");
        }

        const user = await response.json();
        //console.log("Dati ricevuti dal server:", user); // Log dei dati utente ricevuti

        nameDisplay.textContent = user.name || "Non specificato";
        emailDisplay.textContent = user.email || "Non specificato";
        favoriteHeroDisplay.textContent = user.favoriteHero || "Non specificato";
    } catch (err) {
        console.error("Errore nel recupero del profilo:", err.message); // Log dell'errore
        showNotification("Errore nel caricamento del profilo.");
    }
});




document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    //console.log("Token recuperato:", token);  // Debug
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
        console.error("Errore: userId è undefined. Controlla il token.");
        return;
    }
    fetchUserProfile(userId);

    const profileView = document.getElementById("profileView");
    const editButton = document.getElementById("editProfileButton");
    const editForm = document.getElementById("profileEditForm");

    editButton.addEventListener("click", function () {
        profileView.classList.add("d-none");
        editForm.classList.remove("d-none");
    });

    cancelEditButton.addEventListener("click", function () {
        editForm.classList.add("d-none");
        profileView.classList.remove("d-none");
    });

    document.getElementById("profileEditForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita il refresh della pagina
    
        const name = document.getElementById("name").value.trim();
        const favoriteHero = document.getElementById("favoriteHero").value;
        const birthDate = document.getElementById("birthDate").value;
        const phone = document.getElementById("phone").value;
    
        let errorMessages = []; 
    
        if (usernameFeedback.classList.contains("text-danger")) {  
            errorMessages.push("❌ Utente non valido.");
        }

        if (!validateBirthDate(birthDate)) { //serve?
            errorMessages.push("⚠️ La data di nascita non è valida.");
        }
    
        // ✅ Controllo Data di Nascita (frontend)
        const today = new Date().toISOString().split("T")[0];
        if (birthDate && birthDate > today) {
            errorMessages.push("⚠️ La data di nascita non può essere nel futuro.");
        }
    
        // ✅ Controllo Numero di Telefono (frontend)
        if (!validatePhone(phone)) {
            errorMessages.push("⚠️ Il numero di telefono non è valido.");
        }
    
        // ❌ Se ci sono errori frontend, li mostriamo e **blocchiamo la richiesta**
        if (errorMessages.length > 0) {
            errorMessages.forEach(error => showNotification(error, "error"));
            return;
        }
    
        // ✅ Ora possiamo inviare la richiesta PUT al server
        try {
            //console.log("📤 DEBUG - Sto inviando questa richiesta PUT:", { name, favoriteHero, birthDate, phone });
    
            const response = await fetch(`http://localhost:5000/api/user/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, favoriteHero, birthDate, phone })
            });
    
            //console.log("📤 DEBUG - Risposta HTTP:", response.status);
            const data = await response.json();
    
            // ❌ Se il server ha restituito un errore, aggiungiamolo alla lista
            if (!response.ok) {
                console.error("⛔ DEBUG - Errore nell'aggiornamento del profilo:", data);
                return;
            }
    
            // ✅ Successo → Mostriamo la notifica e aspettiamo 1.5s prima di ricaricare la pagina
            showNotification("✅ Profilo aggiornato con successo!", "success");
            setTimeout(() => {
                location.reload();
            }, 1500);
    
        } catch (error) {
            console.error("⛔ DEBUG - Errore nella comunicazione con il server:", error);
            showNotification("⚠️ Errore nella comunicazione con il server.", "danger");
        }
    });

    const passwordChangeForm = document.getElementById("passwordChangeForm");
    const changePasswordButton = document.getElementById("changePasswordButton");
    const cancelPasswordChangeButton = document.getElementById("cancelPasswordChangeButton");


     // Mostra il form per la modifica della password
    changePasswordButton.addEventListener("click", function () {
        profileView.classList.add("d-none");
        passwordChangeForm.classList.remove("d-none");
    });

    // Annulla la modifica della password
    cancelPasswordChangeButton.addEventListener("click", function () {
        passwordChangeForm.classList.add("d-none");
        profileView.classList.remove("d-none");
    });

    // Gestione del submit per la modifica della password
    document.getElementById("passwordChangeForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Blocca il comportamento predefinito

        // Prendi i valori dagli input
        const oldPassword = document.getElementById("oldPassword").value.trim();
        const newPassword = document.getElementById("newPassword").value.trim();
        const confirmNewPassword = document.getElementById("confirmNewPassword").value.trim();

        let errorMessages = []; // Array per raccogliere errori

        // ✅ Invio della richiesta al server
        try {
            //console.log("📤 DEBUG - Invio richiesta cambio password");

            const response = await fetch(`http://localhost:5000/api/user/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });

            const data = await response.json();

            
            if (!response.ok) {
                if (response.status === 400) {
                    errorMessages.push(data.error); // ✅ Aggiunge il messaggio dal server all'array degli errori
                } else {
                    console.error("Errore nell'aggiornamento del profilo:", data);
                    return;
                }
            }

            if (!oldPassword.trim()) { //serve?
                errorMessages.push("⚠️ Inserisci la vecchia password.");
            }

            if (oldPassword === newPassword) {
                errorMessages.push("❌ La nuova password non può essere uguale a quella attuale.");
            }
    
            if (newPassword !== confirmNewPassword) {
                errorMessages.push("❌ Le nuove password non coincidono.");
            }

           

            // ❌ Se ci sono errori, li mostriamo e blocchiamo la richiesta
            if (errorMessages.length > 0) {
                errorMessages.forEach(error => showNotification(error, "error"));
                return;
            }

            // ✅ Password cambiata con successo
            showNotification("✅ Password aggiornata con successo!", "success");

            setTimeout(() => {
                localStorage.removeItem("token"); // Disconnette l'utente
                window.location.href = "login.html"; // Reindirizza alla login
            }, 2000);

        } catch (error) {
            console.error("⛔ DEBUG - Errore nella comunicazione con il server:", error);
            showNotification("⚠️ Errore nella comunicazione con il server.", "danger");
        }
    });


});



function getUserIdFromToken(token) {
    try {
        const decoded = jwt_decode(token);
        //console.log("Decoded Token:", decoded);  // Debug
        //console.log("User ID:", decoded.userId);  // Debug
        return decoded.userId || null;
    } catch (error) {
        console.error("Errore nel decoding del token:", error);
        return null;
    }
}

function validateBirthDate(date) {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
}

function validatePhone(phone) {
    return /^[0-9]{10}$/.test(phone);
}

async function fetchUserProfile(userId) {
    const token = localStorage.getItem("token");
    if (!userId) {
        console.error("Errore: userId non valido.");
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:5000/api/user/users/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Errore nella risposta del server");  

        const user = await response.json();
        //console.log("Dati utente ricevuti:", user);  // Debug
        document.getElementById("nameDisplay").innerText = user.name;
        document.getElementById("emailDisplay").innerText = user.email;
        document.getElementById("favoriteHeroDisplay").innerText = user.favoriteHero || "Non specificato";
        document.getElementById("birthDateDisplay").innerText = user.birthDate || "Non specificata";
        document.getElementById("phoneDisplay").innerText = user.phone || "Non specificato";
    } catch (error) {
        console.error("Errore nel caricamento del profilo:", error);
    }
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
            const response = await fetch(`http://localhost:5000/api/user/check-username/${name}`);
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
    }, 500); // Attende 500ms prima di eseguire la chiamata API
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



/*function checkPasswordStrength(password) {
    const feedbackElement = document.getElementById("passwordFeedback");

    if (!feedbackElement) return; // Se non esiste l'elemento, esci

    if (password.length < 3) {
        feedbackElement.textContent = ""; // Nessun feedback prima di 3 caratteri
        return;
    }

    let strength = 0;
    let suggestion = "";

    // Controlli sulla sicurezza della password (progressivi)
    if (/[A-Z]/.test(password)) {
        strength += 1;
    } else {
        suggestion = "Password non sicura. Aggiungi almeno una lettera maiuscola.";
    }

    if (/\d/.test(password)) {
        strength += 1;
    } else if (strength === 1) { // Mostra il suggerimento solo se la maiuscola è già presente
        suggestion = "Password non sicura. Aggiungi almeno un numero.";
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        strength += 1;
    } else if (strength === 2) { // Mostra il suggerimento solo se i numeri sono già presenti
        suggestion = "Password non sicura. Aggiungi almeno un carattere speciale.";
    }

    if (password.length >= 8) {
        strength += 1;
    } else if (strength === 3) { // Mostra il suggerimento solo alla fine
        suggestion = "Password non sicura. Usa almeno 8 caratteri.";
    }

    // Cambiamo il messaggio in base alla sicurezza della password
    feedbackElement.className = "form-text mt-1"; // Reset classi
    if (strength === 4) {
        feedbackElement.textContent = "✅ Password Sicura!";
        feedbackElement.classList.add("text-success");
    } else {
        feedbackElement.textContent = suggestion || "⚠️ Password poco sicura.";
        feedbackElement.classList.add("text-warning");
    }
}*/













