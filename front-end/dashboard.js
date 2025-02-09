
document.addEventListener('DOMContentLoaded', async () => {
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

    console.log("🔹 Crediti salvati in localStorage:", localStorage.getItem("credits"));

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

        // Aggiorniamo il valore dei crediti nella dashboard
        const creditiElement = document.getElementById("crediti");
        if (creditiElement) {
            const savedCredits = localStorage.getItem("credits");
            if (savedCredits !== null) {
                creditiElement.textContent = savedCredits;
            } else {
                creditiElement.textContent = user.credits;
            }
        } else {
            console.error("Elemento con id 'crediti' non trovato!");
        }
        localStorage.removeItem("credits");


        const buyPackButton = document.getElementById("buy-pack-btn");

        if (user.credits < 1) {
            buyPackButton.classList.add("disabled");
            buyPackButton.addEventListener("click", (event) => {
                event.preventDefault();
                showNotification("Crediti insufficienti! Acquista più crediti per comprare un pacchetto.", "danger");
            });
        }
        
    } catch (error) {
        console.error("Errore nel recupero dei crediti:", error);
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

        const creditiElement = document.getElementById("crediti");
        if (creditiElement) {
            creditiElement.textContent = data.newCredits;
            setTimeout(() => { // è la soluzione migliore?
                location.reload();
            }, 50);
        } else {
            console.error("Elemento 'crediti' non trovato!");
        }

    } catch (error) {
        console.error("Errore nell'acquisto dei crediti:", error);
        showNotification("Errore durante l'acquisto dei crediti.", "danger");
    }
});








