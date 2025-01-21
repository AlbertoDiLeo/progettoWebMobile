//import { getToken, removeToken, showNotification } from './lib.js'; // Se usi moduli
//import jwt_decode from 'jwt-decode';
document.addEventListener('DOMContentLoaded', initializeDashboard);

function initializeDashboard() {
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
}

/*document.addEventListener('DOMContentLoaded', () => {
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
});*/



