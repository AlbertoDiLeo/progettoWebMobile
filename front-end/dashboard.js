//import { getToken, removeToken, showNotification } from './lib.js'; // Se usi moduli
//import jwt_decode from 'jwt-decode';


document.addEventListener('DOMContentLoaded', () => {
    const token = getToken();

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
        showNotification('Errore di autenticazione. Effettua nuovamente il login.', 'danger');
        removeToken('token');
        window.location.href = 'login.html';
    }
});


document.addEventListener('DOMContentLoaded', async () => {
    const creditsElement = document.querySelector('.card-text strong'); // Seleziona l'elemento dei crediti

    try {
        // Recupera il token JWT da localStorage
        const token = getToken();
        if (!token) throw new Error('Utente non autenticato');

        // Decodifica il token per ottenere l'ID utente
        const decoded = jwt_decode(token); // Richiede la libreria jwt-decode
        const userId = decoded.id; // Assumendo che il tuo JWT abbia un campo "id"

        // Effettua la richiesta al server
        const response = await fetch(`/api/auth/user/credits?userId=${userId}`);
        if (!response.ok) throw new Error('Errore nel recupero dei crediti');
        
        const data = await response.json();
        creditsElement.textContent = data.credits; // Aggiorna i crediti dinamicamente
    } catch (error) {
        console.error('Errore:', error);
        creditsElement.textContent = 'Errore'; // Mostra errore se la chiamata fallisce
    }
});
