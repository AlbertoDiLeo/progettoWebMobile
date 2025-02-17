
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

if (registerForm) {
    document.addEventListener('DOMContentLoaded', populateHeroesDropdown);
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Previene il refresh della pagina

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const favoriteHero = document.getElementById('favoriteHero').value;

    let errors = [];

    if (!name || !email || !password || !favoriteHero) {
      errors.push("Tutti i campi sono obbligatori");
    }

    if (password !== confirmPassword) {
      errors.push("Le password non corrispondono");
    }

    // Verifica se l'input del nome utente è valido 
    const usernameFeedback = document.getElementById('usernameFeedback');
    if (usernameFeedback && (usernameFeedback.classList.contains("text-danger") || usernameFeedback.classList.contains("text-warning"))) {
      errors.push("Nome utente non valido");
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
          let allErrors = [];
          if (Array.isArray(data.messages)) {
              allErrors = allErrors.concat(data.messages);
          }
          if (errors.length > 0) {
              allErrors = allErrors.concat(errors);
          }
          if (allErrors.length > 0) {
              allErrors.forEach(error => showNotification(error, "danger"));
          } else {
              showNotification(data.message || "Errore durante la registrazione", "danger");
          }
          return;
        }

      showNotification("Registrazione avvenuta con successo!", "success");

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);

    } catch (error) {
      console.error('Errore nella registrazione:', error);
      showNotification('Errore durante la registrazione. Riprova più tardi.', "danger");
    }
  });
}




const loginForm = document.getElementById('loginForm'); 

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

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

            if (response.ok) { 
                showNotification('Login completato con successo!', 'success');
                localStorage.setItem('token', data.token);
                setTimeout(() => {
                    window.location.href = 'dashboard.html'; 
                }, 1000);    
            } else {
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