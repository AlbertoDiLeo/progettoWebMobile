

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


        if (!validateBirthDate(birthDate)) {
            showNotification("Inserisci una data valida.");
            return;
        }

        if (!validatePhone(phone)) {
            showNotification("Inserisci un numero di telefono valido (10-15 cifre).");
            return;
        }

        try {
            console.log("Sto inviando la richiesta PUT con userId:", userId);
            const response = await fetch(`http://localhost:5000/api/user/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, favoriteHero, birthDate, phone })
            });

            console.log("📤 DEBUG - Risposta HTTP:", response.status);


            if (response.ok) {
                showNotification("Profilo aggiornato con successo!");
                location.reload();
            } else {
                const errorData = await response.json();
                console.error("⛔ DEBUG - Errore nell'aggiornamento del profilo:", errorData);
                showNotification("Errore nell'aggiornamento del profilo.", "error");
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
    return /^[0-9]{10,15}$/.test(phone);
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




