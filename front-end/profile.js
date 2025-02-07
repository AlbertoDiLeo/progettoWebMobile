

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
    console.log("Token recuperato:", token);  // Debug
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
        console.error("Errore: userId è undefined. Controlla il token.");
        //return;
    }
    fetchUserProfile(userId);

    const editButton = document.getElementById("editProfileButton");
    const editForm = document.getElementById("profileEditForm");
    const profileView = document.getElementById("profileView");
    const cancelEditButton = document.getElementById("cancelEditButton");

    editButton.addEventListener("click", function () {
        profileView.classList.add("d-none");
        editForm.classList.remove("d-none");
    });

    cancelEditButton.addEventListener("click", function () {
        editForm.classList.add("d-none");
        profileView.classList.remove("d-none");
    });

    document.getElementById("profileEditForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value; 
        const favoriteHero = document.getElementById("favoriteHero").value;
        const birthDate = document.getElementById("birthDate").value;
        const phone = document.getElementById("phone").value;
        console.log("Dati inviati al server:", { name, favoriteHero, birthDate, phone });

        let errorMessages = []; // Array per raccogliere tutti gli errori

        // ✅ Controllo Nome
        if (name.length < 3) {
            errorMessages.push("⚠️ Il nome deve avere almeno 3 caratteri.");
        }
        if (!/^[a-zA-Z0-9]+$/.test(name)) {
            errorMessages.push("❌ Il nome può contenere solo lettere e numeri.");
        }

        // ✅ Controllo Data di Nascita
        //const today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
        if (!validateBirthDate(birthDate)) {
            errorMessages.push("⚠️ La data di nascita non può essere nel futuro.");
        }

        // ✅ Controllo Numero di Telefono
        if (!validatePhone(phone)) {
            errorMessages.push("⚠️ Il numero di telefono deve avere 10 cifre.");
        }

        // ❌ Se ci sono errori, li mostriamo e **blocchiamo la richiesta**
        if (errorMessages.length > 0) {
            showNotification(errorMessages.join("<br>"), "danger"); // Mostra tutti gli errori insieme
            return;
        }

        try {
            //console.log("Sto inviando la richiesta PUT con userId:", userId);
            const response = await fetch(`http://localhost:5000/api/user/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, favoriteHero, birthDate, phone })
            });

            //console.log("📤 DEBUG - Risposta HTTP:", response.status);


            if (!response.ok) {
                const errorData = await response.json();
                console.error("⛔ DEBUG - Errore nell'aggiornamento del profilo:", errorData)
            } else {
                // ✅ Se la richiesta ha avuto successo
                showNotification("✅ Profilo aggiornato con successo!", "success");
                
                // Attendi 1.5 secondi prima di ricaricare la pagina
                setTimeout(() => {
                    location.reload();
                }, 1500);
            }
                
        } catch (error) {
            console.error("⛔ DEBUG - Errore nella comunicazione con il server:", error);
            showNotification("Errore nella comunicazione con il server.");
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





