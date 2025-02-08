//console.log('File auth.js caricato correttamente ciao');

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

        let errors = []; 

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, favoriteHero }),
            });

            const data = await response.json();

           if (!response.ok) {
                if (Array.isArray(data.messages)) {
                    errors = errors.concat(data.messages); // ✅ Aggiunge errori dal backend
                } else {
                    errors.push(data.message);
                }
            }
            
        } catch (error) {
            console.error('Errore nella registrazione:', error);
            showNotification('Si è verificato un errore. Riprova più tardi.', "error");
            return;
        }

        if (usernameFeedback.classList.contains("text-danger") || usernameFeedback.classList.contains("text-warning")) {  
            errors.push("❌ Utente non valido.");
        }

        // Verifica che le password corrispondano
        if (password !== confirmPassword) {
            errors.push("Le password non corrispondono");
        }

        if (errors.length > 0) {
            errors.forEach(error => showNotification(error, "error"));
            return;
        }

        showNotification("Registrazione avvenuta con successo!", "success");
        setTimeout(() => {
            window.location.href = 'login.html'; // Reindirizza dopo 1 secondo
        }, 1000);

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
                showNotification('Login completato con successo!', 'success');
                // Salva il token JWT nel localStorage
                //console.log('Token ricevuto dal server:', data.token);  // Debug
                localStorage.setItem('token', data.token);
                //console.log('Token salvato in localStorage:', localStorage.getItem('token')); // Controllo
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



//module.exports = router;
