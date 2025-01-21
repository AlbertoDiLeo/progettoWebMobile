async function getProfile() {
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
}

// Chiama la funzione getProfile quando la pagina viene caricata
document.addEventListener('DOMContentLoaded', getProfile);