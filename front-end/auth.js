

//da sistemare

/*const registerForm = document.getElementById('registerForm'); 

if (registerForm) {
    document.addEventListener('DOMContentLoaded', populateHeroesDropdown);
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previene il refresh della pagina

        // Ottieni i dati dal form
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const favoriteHero = document.getElementById('favoriteHero').value;

        let errors = []; // non necessario

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, favoriteHero }),
            });

            const data = await response.json();

           if (!response.ok) { //da rivedere
                if (Array.isArray(data.messages)) {
                    errors = errors.concat(data.messages); // Aggiunge errori dal backend
                } else {
                    errors.push(data.message);
                }
            }
            
        } catch (error) {
            console.error('Errore nella registrazione:', error);
            showNotification('Si è verificato un errore. Riprova più tardi.', "danger");
            return;
        }

        if (usernameFeedback.classList.contains("text-danger") || usernameFeedback.classList.contains("text-warning")) {  
            errors.push("Utente non valido");
        }

        // Verifica che le password corrispondano
        if (password !== confirmPassword) {
            errors.push("Le password non corrispondono");
        }

        if (errors.length > 0) {
            errors.forEach(error => showNotification(error, "danger"));
            return;
        }

        showNotification("Registrazione avvenuta con successo!", "success");

        setTimeout(() => {
            window.location.href = 'login.html'; // Reindirizza dopo 1 secondo
        }, 1000);

    });
} 

async function populateHeroesDropdown() {
    try {
      const response = await fetch('http://localhost:3000/api/marvel/heroes');
      const heroes = await response.json();
      const select = document.getElementById('favoriteHero');
  
      heroes.forEach(hero => {
        const option = document.createElement('option');
        option.value = hero.name;
        option.textContent = hero.name;
        select.appendChild(option);
      });
    } catch (error) {
      console.error('Errore nel recupero degli eroi:', error);
    }
}*/



// Ottieni il form
const registerForm = document.getElementById('registerForm'); 

// Funzione per popolare il menu a tendina con gli eroi
async function populateHeroesDropdown() {
  try {
    const response = await fetch('http://localhost:3000/api/marvel/heroes'); 
    if (!response.ok) throw new Error('Errore nel recupero degli eroi');

    const heroes = await response.json();
    const select = document.getElementById('favoriteHero');

 

    heroes.sort((a, b) => a.localeCompare(b));

    heroes.forEach(hero => {
      const option = document.createElement('option');
      option.value = hero;
      option.textContent = hero;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Errore nel recupero degli eroi:', error);
    showNotification('Errore nel recupero degli eroi. Riprova più tardi.', "danger");
  }
}

// Gestione della registrazione
if (registerForm) {
    document.addEventListener('DOMContentLoaded', populateHeroesDropdown);
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Previene il refresh della pagina

    // Ottieni i dati dal form
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const favoriteHero = document.getElementById('favoriteHero').value;

    let errors = [];

    // Validazione lato client
    if (!name || !email || !password || !favoriteHero) {
      errors.push("Tutti i campi sono obbligatori");
    }

    if (password !== confirmPassword) {
      errors.push("Le password non corrispondono");
    }

    // Verifica se l'input del nome utente è valido (opzionale)
    const usernameFeedback = document.getElementById('usernameFeedback');
    if (usernameFeedback && (usernameFeedback.classList.contains("text-danger") || usernameFeedback.classList.contains("text-warning"))) {
      errors.push("Nome utente non valido");
    }

    if (errors.length > 0) {
      errors.forEach(error => showNotification(error, "danger"));
      return;
    }

    // Effettua la registrazione
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, favoriteHero }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.messages)) {
          data.messages.forEach(msg => showNotification(msg, "danger"));
        } else {
          showNotification(data.message || "Errore durante la registrazione", "danger");
        }
        return;
      }

      // Se la registrazione è andata a buon fine
      showNotification("Registrazione avvenuta con successo!", "success");

      // Reindirizza dopo 1 secondo
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);

    } catch (error) {
      console.error('Errore nella registrazione:', error);
      showNotification('Errore durante la registrazione. Riprova più tardi.', "danger");
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
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) { //da rivedere
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
                    showNotification('Email non registrata.', 'danger');
                } else if (response.status === 401) {
                    showNotification('Password errata.', 'danger');
                } else {
                    showNotification(`Errore: ${data.message}`, 'danger');
                }
            }
        } catch (error) {
            console.error('Errore nel login:', error);
            showNotification('Si è verificato un errore. Riprova più tardi.', 'danger');
        }
    });
}



//module.exports = router;
