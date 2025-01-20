console.log('File auth.js caricato correttamente');

//import {setLocalStorage, removeToken, showNotification } from './lib.js';


const registerForm = document.getElementById('registerForm'); //register.html

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previene il refresh della pagina

        // Ottieni i dati dal form
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const favoriteHero = document.getElementById('favoriteHero').value;

        // Verifica che le password corrispondano
        if (password !== confirmPassword) {
            showNotification('Le password non corrispondono. Riprova.', 'error');
            return; // Interrompe l'esecuzione se le password non coincidono
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, favoriteHero }),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Registrazione completata! Ora puoi effettuare il login.');
                setTimeout(() => {
                    window.location.href = 'login.html'; // Reindirizza dopo 3 secondi
                }, 1000);
            } else {
                showNotification(`Errore: ${data.message}`, 'error');
            }
        } catch (error) {
            console.error('Errore nella registrazione:', error);
            showNotification('Si è verificato un errore. Riprova più tardi.');
        }
    });
} 





const loginForm = document.getElementById('loginForm'); //login.html

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previene il refresh della pagina

        // Ottieni i dati dal form
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Login completato con successo!');
                // Salva il token JWT nel localStorage
                setLocalStorage('token', data.token);
                //localStorage.setItem('token', data.token);
                setTimeout(() => {
                    window.location.href = 'dashboard.html'; // Reindirizza dopo 3 secondi
                }, 1000);    
            } else {
                 // Gestisce errori specifici
                if (response.status === 404) {
                    showNotification('Email non registrata.', 'error');
                } else if (response.status === 401) {
                    showNotification('Password errata.', 'error');
                } else {
                    showNotification(`Errore: ${data.message}`, 'error');
                }
            }
        } catch (error) {
            console.error('Errore nel login:', error);
            showNotification('Si è verificato un errore. Riprova più tardi.', 'error');
        }
    });
}

const confirmLogoutButton = document.getElementById('confirmLogout');

if (confirmLogoutButton) {
    confirmLogoutButton.addEventListener('click', () => {
        // Rimuove il token JWT dal localStorage
        removeToken('token');

        // Opzionale: Mostra un messaggio di logout
        showNotification('Logout effettuato con successo!');

        // Reindirizza l'utente alla pagina di login
        window.location.href = 'login.html';
    });
}



/*function checkAuthentication() { // non so quanto utile e non funziona correttamente
    const token = localStorage.getItem('token'); // Recupera il token dal localStorage

    if (!token) {
        // Se il token manca, reindirizza alla pagina di login
        alert('Devi effettuare il login per accedere a questa pagina.');
        window.location.href = 'login.html';
    }
}

// Chiama il controllo di autenticazione quando carica la pagina
document.addEventListener('DOMContentLoaded', checkAuthentication);*/





