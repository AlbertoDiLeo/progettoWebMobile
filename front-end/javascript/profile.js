
async function populateHeroesDropdown() {
    try {
      const response = await fetch('http://localhost:3000/api/marvel/heroes'); 
      if (!response.ok) throw new Error('Errore nel recupero degli eroi');
  
      const heroes = await response.json();
      const select = document.getElementById('favoriteHero');
      heroes.sort((a, b) => a.localeCompare(b));
  
      heroes.forEach(hero => {
        const option = document.createElement('option');
        option.value = hero;
        option.textContent = hero;
        select.appendChild(option);
      });
    } catch (error) {
      console.error('Errore nel recupero degli eroi:', error);
      showNotification('Errore nel recupero degli eroi. Riprova più tardi.', "danger");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    
    const userId = getUserIdFromToken(token);
    if (!userId) {
        console.error("Errore: userId è undefined. Controlla il token.");
        return;
    }

    const nameDisplay = document.getElementById("nameDisplay");
    const emailDisplay = document.getElementById("emailDisplay");
    const favoriteHeroDisplay = document.getElementById("favoriteHeroDisplay");

    try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Invia il token al server
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Errore API:", error.message); // Log dell'errore API
            throw new Error("Errore nella richiesta del profilo");
        }
        const user = await response.json();

        nameDisplay.textContent = user.name || "Non specificato";
        emailDisplay.textContent = user.email || "Non specificato";
        favoriteHeroDisplay.textContent = user.favoriteHero || "Non specificato";
    } catch (err) {
        console.error("Errore nel recupero del profilo:", err.message); // Log dell'errore
        showNotification("Errore nel caricamento del profilo.", "danger"); 
    }
});




document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
        console.error("Errore: userId è undefined. Controlla il token.");
        return;
    }

    await populateHeroesDropdown();
    fetchUserProfile(userId);

    const profileView = document.getElementById("profileView");
    const editButton = document.getElementById("editProfileButton");
    const editForm = document.getElementById("profileEditForm");

    editButton.addEventListener("click", async () => {
        profileView.classList.add("d-none");
        editForm.classList.remove("d-none");
    });

    cancelEditButton.addEventListener("click", async () => {
        editForm.classList.add("d-none");
        profileView.classList.remove("d-none");
    });
    

    document.getElementById("profileEditForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita il refresh della pagina
        
        const nameInput = document.getElementById("name").value;
        const favoriteHeroInput = document.getElementById("favoriteHero").value;
        const birthDateInput = document.getElementById("birthDate").value;
        const phoneInput = document.getElementById("phone").value;
    
        let errorMessages = [];
    
        if (usernameFeedback.classList.contains("text-danger") || usernameFeedback.classList.contains("text-warning")) {  
            errorMessages.push("Utente non valido.");
        }
    
        const today = new Date().toISOString().split("T")[0];
        if (birthDateInput && birthDateInput > today) {
            errorMessages.push("La data di nascita non può essere nel futuro.");
        }
    
        if (phoneInput && !validatePhone(phoneInput)) {
            errorMessages.push("Il numero di telefono non è valido.");
        }
    
        if (errorMessages.length > 0) {
            errorMessages.forEach(error => showNotification(error, "danger"));
            return;
        }
    
        try {
            const token = localStorage.getItem("token");
            const userId = getUserIdFromToken(token);
            
            // Recupera i dati attuali dell'utente
            const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
    
            if (!response.ok) throw new Error("Errore nel recupero del profilo.");
    
            const currentUser = await response.json();
    
            // Usa i dati attuali se l'input è vuoto
            const updatedUser = {
                name: nameInput || currentUser.name,
                favoriteHero: favoriteHeroInput || currentUser.favoriteHero,
                birthDate: birthDateInput || currentUser.birthDate,
                phone: phoneInput || currentUser.phone
            };
    
            // Invia solo i dati aggiornati al server
            const updateResponse = await fetch(`http://localhost:3000/api/user/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedUser)
            });
    
            const data = await updateResponse.json();
    
            if (!updateResponse.ok) {
                console.error("Errore nell'aggiornamento del profilo:", data);
                return;
            }
    
            showNotification("Profilo aggiornato con successo!", "success");

            if (data.newToken) {
                localStorage.setItem("token", data.newToken);
            }
    
            setTimeout(() => {
                location.reload();
                //window.location.href = "dashboard.html";
            }, 1500);
    
        } catch (error) {
            console.error("Errore nella comunicazione con il server:", error);
            showNotification("Errore nella comunicazione con il server.", "danger");
        }
    });

    
});

document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    
    const userId = getUserIdFromToken(token);
    if (!userId) {
        console.error("Errore: userId è undefined. Controlla il token.");
        return;
    }

    const passwordChangeForm = document.getElementById("passwordChangeForm");
    const changePasswordButton = document.getElementById("changePasswordButton");
    const cancelPasswordChangeButton = document.getElementById("cancelPasswordChangeButton");


     // Mostra il form per la modifica della password
    changePasswordButton.addEventListener("click", async () => {
        profileView.classList.add("d-none");
        passwordChangeForm.classList.remove("d-none");
    });

    // Annulla la modifica della password
    cancelPasswordChangeButton.addEventListener("click", async () => {
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

        let errorMessages = []; 

        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken(token);

        try {
            const response = await fetch(`http://localhost:3000/api/user/change-password/${userId}`, {
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
                    errorMessages.push(data.error); 
                } else {
                    console.error("Errore nell'aggiornamento del profilo:", data);
                    return;
                }
            }

            if (!oldPassword.trim()) { 
                errorMessages.push("Inserisci la vecchia password.");
            }
            if (oldPassword === newPassword) {
                errorMessages.push("La nuova password non può essere uguale a quella attuale.");
            }
            if (newPassword !== confirmNewPassword) {
                errorMessages.push("Le nuove password non coincidono.");
            } 

            if (errorMessages.length > 0) {
                errorMessages.forEach(error => showNotification(error, "danger"));
                return;
            }

            showNotification("Password aggiornata con successo!", "success");

            setTimeout(() => {
                localStorage.removeItem("token"); // Disconnette l'utente
                window.location.href = "login.html"; 
            }, 2000);

        } catch (error) {
            console.error("Errore nella comunicazione con il server:", error);
            showNotification("Errore nella comunicazione con il server.", "danger");
        }
    });
});


document.getElementById("deleteAccountButton").addEventListener("click", async () => {
    // Mostra il modale di conferma
    const deleteModal = new bootstrap.Modal(document.getElementById("deleteAccountModal"));
    deleteModal.show();
});

// Quando l'utente conferma l'eliminazione
document.getElementById("confirmDeleteAccount").addEventListener("click", async function () {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);

    if (!userId) {
        showNotification("Errore: impossibile determinare l'utente.", "danger");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/user/delete/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 403) {
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteAccountModal"));
            if (deleteModal) deleteModal.hide();
            // **L'utente ha scambi pendenti, impediamo l'eliminazione**
            showNotification("Impossibile eliminare l'account: hai scambi pendenti.", "danger"|| data.error);
            return;
        }

        if (!response.ok) {
            console.error("Errore dal server:", data);
            showNotification(data.error || "Errore sconosciuto.", "danger");
            return;
        }

        // **Chiude il modale immediatamente dopo la conferma**
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteAccountModal"));
        if (deleteModal) deleteModal.hide();

        showNotification("Account eliminato con successo. Verrai reindirizzato alla home.", "success");

        setTimeout(() => {
            localStorage.removeItem("token"); // Disconnette l'utente
            window.location.href = "index.html"; // Reindirizza alla home
        }, 1000);

    } catch (error) {
        console.error("Errore nella comunicazione con il server:", error);
        showNotification("Errore nella comunicazione con il server.", "danger");
    }
});






function getUserIdFromToken(token) {
    try {
        const decoded = jwt_decode(token);
        return decoded.userId || null;
    } catch (error) {
        console.error("Errore nel decoding del token:", error);
        return null;
    }
}


async function fetchUserProfile(userId) {
    const token = localStorage.getItem("token");
    if (!userId) {
        console.error("Errore: userId non valido.");
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Errore nella risposta del server");  

        const user = await response.json();
        document.getElementById("nameDisplay").innerText = user.name;
        document.getElementById("emailDisplay").innerText = user.email;
        document.getElementById("favoriteHeroDisplay").innerText = user.favoriteHero || "Non specificato";
        document.getElementById("birthDateDisplay").innerText = user.birthDate 
        ? formatDate(user.birthDate) 
        : "Non specificata";

        document.getElementById("phoneDisplay").innerText = user.phone || "Non specificato";

        const favoriteHeroSelect = document.getElementById("favoriteHero");
        if (favoriteHeroSelect && user.favoriteHero) {
            const optionToSelect = Array.from(favoriteHeroSelect.options).find(option => option.value === user.favoriteHero);
            if (optionToSelect) {
                optionToSelect.selected = true;
            }
        }
    } catch (error) {
        console.error("Errore nel caricamento del profilo:", error);
    }
}

function validatePhone(phone) {
    return /^[0-9]{10}$/.test(phone);
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mesi da 0 a 11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}












