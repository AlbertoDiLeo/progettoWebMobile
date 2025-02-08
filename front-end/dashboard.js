
document.addEventListener('DOMContentLoaded', async () => {
//function initializeDashboard() {
    const token = localStorage.getItem('token');
    console.log("token:", token);

    if (!token) {
        showNotification('Accesso non autorizzato. Effettua il login.', 'danger');
        window.location.href = 'login.html';
        return;
    }

    try {
        const decoded = jwt_decode(token); // Decodifica il token (includi jwt-decode nel progetto)
        const welcomeMessage = document.getElementById('welcomeMessage');
        
        if (decoded.name && decoded.favoriteHero) {
            welcomeMessage.textContent = `Benvenuto, ${decoded.name}! Il tuo supereroe preferito è ${decoded.favoriteHero}.`;
        } else {
            welcomeMessage.textContent = 'Benvenuto nella tua Dashboard!';
        }
    } catch (error) {
        console.error('Errore nella decodifica del token:', error);
        showNotification('Errore di autenticazione. Effettua nuovamente il login.', 'error');
        removeToken('token');
        window.location.href = 'login.html';
    }
});


document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/user/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error("Errore nel recupero del profilo");
        }

        const user = await response.json();
        console.log("✅ Crediti ricevuti:", user.credits);

        // Aggiorniamo il valore dei crediti nella dashboard
        document.getElementById("crediti").textContent = user.credits;
    } catch (error) {
        console.error("❌ Errore nel recupero dei crediti:", error);
        document.getElementById("crediti").textContent = "Errore";
    }
});


document.getElementById("buy-credits-btn").addEventListener("click", async () => {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/user/buy-credits", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount: 1 }) // Aggiunge 1 credito   
        });

        if (!response.ok) {
            throw new Error("Errore nell'acquisto dei crediti");
        }

        const data = await response.json();
        console.log("✅ Nuovo saldo crediti:", data.newCredits);

        // Aggiorniamo il valore dei crediti nella dashboard
        document.getElementById("crediti").textContent = data.newCredits;
    } catch (error) {
        console.error("❌ Errore nell'acquisto dei crediti:", error);
        alert("Errore durante l'acquisto dei crediti.");
    }
});








