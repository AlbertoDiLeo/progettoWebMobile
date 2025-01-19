console.log('File auth.js caricato correttamente');


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
            alert('Si è verificato un errore. Riprova più tardi.');
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
                localStorage.setItem('token', data.token);
                setTimeout(() => {
                    window.location.href = 'dashboard.html'; // Reindirizza dopo 3 secondi
                }, 1000);    
            } else {
                showNotification(`Errore: ${data.message}`, 'error');
            }
        } catch (error) {
            console.error('Errore nel login:', error);
            alert('Si è verificato un errore. Riprova più tardi.');
        }
    });
}



function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');

    // Rimuove le classi precedenti
    notification.className = 'alert';

    // Aggiunge la classe per il tipo di alert
    if (type === 'success') {
        notification.classList.add('alert-success'); // Stile verde per i successi
    } else {
        notification.classList.add('alert-danger'); // Stile rosso per gli errori
    }

    // Mostra l'alert con il messaggio
    notification.classList.remove('d-none');
    notification.textContent = message;

    // Nasconde l'alert dopo 5 secondi
    setTimeout(() => {
        notification.classList.add('d-none');
    }, 5000);
}


