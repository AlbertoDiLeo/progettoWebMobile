/*async function getProfile() {
    try {
        const token = getToken(); // Ottieni il token
        console.log('Token JWT:', token); // Stampa il token

        const response = await fetch("http://localhost:5000/api/user/profile", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Aggiungi il token JWT se necessario
            }
        });

        if (!response.ok) {
            throw new Error('Errore nella richiesta del profilo');
        }

        const data = await response.json();
        console.log('Dati del profilo:', data);

        // Aggiorna l'interfaccia utente con i dati del profilo
        document.getElementById('nameDisplay').textContent = data.name;
        document.getElementById('emailDisplay').textContent = data.email;
        document.getElementById('favoriteHeroDisplay').textContent = data.favoriteHero;
        document.getElementById('birthDateDisplay').textContent = data.birthDate || 'Non specificata';
        document.getElementById('phoneDisplay').textContent = data.phone || 'Non specificato';
        document.getElementById('createdAtDisplay').textContent = new Date(data.createdAt).toLocaleDateString();
    } catch (error) {
        console.error('Errore nel recupero del profilo:', error);
    }

// Chiama la funzione getProfile quando la pagina viene caricata
document.addEventListener('DOMContentLoaded', getProfile);
}*/

document.addEventListener("DOMContentLoaded", async () => {
    const nameDisplay = document.getElementById("nameDisplay");
    const emailDisplay = document.getElementById("emailDisplay");
    const favoriteHeroDisplay = document.getElementById("favoriteHeroDisplay");
    //console.log(nameDisplay);

    try {
        const token = getToken("token"); // Recupera il token
        console.log("Token recuperato da localStorage:", token); // Log del token

        const response = await fetch("http://localhost:5000/api/user/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Invia il token al server
            },
        });

        console.log("Risposta HTTP:", response); // Log della risposta HTTP

        if (!response.ok) {
            const error = await response.json();
            console.error("Errore API:", error.message); // Log dell'errore API
            throw new Error("Errore nella richiesta del profilo");
        }

        const user = await response.json();
        console.log("Dati ricevuti dal server:", user); // Log dei dati utente ricevuti

        nameDisplay.textContent = user.name || "Non specificato";
        emailDisplay.textContent = user.email || "Non specificato";
        favoriteHeroDisplay.textContent = user.favoriteHero || "Non specificato";
    } catch (err) {
        console.error("Errore nel recupero del profilo:", err.message); // Log dell'errore
        alert("Errore nel caricamento del profilo.");
    }
});


