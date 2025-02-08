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
    
    await fetchUserProfile(userId);
    setupProfileEditing(userId, token);
    setupPasswordChange(token);
    setupAccountDeletion(userId, token);
});

async function fetchUserProfile(userId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:5000/api/user/users/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Errore nella risposta del server");  

        const user = await response.json();
        updateProfileUI(user);
    } catch (error) {
        console.error("Errore nel caricamento del profilo:", error);
    }
}

function updateProfileUI(user) {
    document.getElementById("nameDisplay").innerText = user.name || "Non specificato";
    document.getElementById("emailDisplay").innerText = user.email || "Non specificato";
    document.getElementById("favoriteHeroDisplay").innerText = user.favoriteHero || "Non specificato";
    document.getElementById("birthDateDisplay").innerText = user.birthDate || "Non specificata";
    document.getElementById("phoneDisplay").innerText = user.phone || "Non specificato";
}

function setupProfileEditing(userId, token) {
    const profileView = document.getElementById("profileView");
    const editForm = document.getElementById("profileEditForm");
    
    document.getElementById("editProfileButton").addEventListener("click", () => {
        profileView.classList.add("d-none");
        editForm.classList.remove("d-none");
    });
    
    document.getElementById("cancelEditButton").addEventListener("click", () => {
        editForm.classList.add("d-none");
        profileView.classList.remove("d-none");
    });
    
    document.getElementById("profileEditForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        await handleProfileUpdate(userId, token);
    });
}

async function handleProfileUpdate(userId, token) {
    const name = document.getElementById("name").value.trim();
    const favoriteHero = document.getElementById("favoriteHero").value;
    const birthDate = document.getElementById("birthDate").value;
    const phone = document.getElementById("phone").value;

    if (!validateProfileInputs(birthDate, phone)) return;

    try {
        const response = await fetch(`http://localhost:5000/api/user/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, favoriteHero, birthDate, phone })
        });
        if (!response.ok) throw new Error("Errore nell'aggiornamento del profilo");
        
        showNotification("✅ Profilo aggiornato con successo!", "success");
        setTimeout(() => location.reload(), 1500);
    } catch (error) {
        console.error("Errore nell'aggiornamento del profilo:", error);
    }
}

function validateProfileInputs(birthDate, phone) {
    let errorMessages = [];
    if (birthDate && new Date(birthDate) > new Date()) {
        errorMessages.push("⚠️ La data di nascita non può essere nel futuro.");
    }
    if (!validatePhone(phone)) {
        errorMessages.push("⚠️ Il numero di telefono non è valido.");
    }
    if (errorMessages.length > 0) {
        errorMessages.forEach(error => showNotification(error, "error"));
        return false;
    }
    return true;
}

function setupPasswordChange(token) {
    document.getElementById("changePasswordButton").addEventListener("click", () => {
        document.getElementById("profileView").classList.add("d-none");
        document.getElementById("passwordChangeForm").classList.remove("d-none");
    });
    
    document.getElementById("cancelPasswordChangeButton").addEventListener("click", () => {
        document.getElementById("passwordChangeForm").classList.add("d-none");
        document.getElementById("profileView").classList.remove("d-none");
    });
    
    document.getElementById("passwordChangeForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        await handlePasswordChange(token);
    });
}

async function handlePasswordChange(token) {
    const oldPassword = document.getElementById("oldPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmNewPassword = document.getElementById("confirmNewPassword").value.trim();
    
    if (newPassword !== confirmNewPassword) {
        showNotification("❌ Le nuove password non coincidono.", "error");
        return;
    }
    
    try {
        const response = await fetch("http://localhost:5000/api/user/change-password", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ oldPassword, newPassword })
        });
        if (!response.ok) throw new Error("Errore nel cambio password");
        
        showNotification("✅ Password aggiornata con successo!", "success");
        setTimeout(() => {
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }, 2000);
    } catch (error) {
        console.error("Errore nel cambio password:", error);
    }
}

function setupAccountDeletion(userId, token) {
    document.getElementById("deleteAccountButton").addEventListener("click", () => {
        new bootstrap.Modal(document.getElementById("deleteAccountModal")).show();
    });
    
    document.getElementById("confirmDeleteAccount").addEventListener("click", async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/delete/${userId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Errore nell'eliminazione dell'account");
            
            showNotification("✅ Account eliminato con successo. Verrai reindirizzato.", "success");
            setTimeout(() => {
                localStorage.removeItem("token");
                window.location.href = "index.html";
            }, 1000);
        } catch (error) {
            console.error("Errore nell'eliminazione dell'account:", error);
        }
    });
}






