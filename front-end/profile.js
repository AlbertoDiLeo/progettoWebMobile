

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    console.log('Token recuperato dal localStorage:', token);

    if (!token) {
        alert('Accesso non autorizzato. Effettua il login.');
        window.location.href = 'login.html';
        return;
    }

    const decoded = jwt_decode(token);
    console.log('Dati decodificati dal token:', decoded);


    // Popola i dati dell'utente nella visualizzazione
    document.getElementById('nameDisplay').textContent = decoded.name || 'Non specificato';
    document.getElementById('emailDisplay').textContent = decoded.email || 'Non specificato';
    document.getElementById('favoriteHeroDisplay').textContent = decoded.favoriteHero || 'Non specificato';
    document.getElementById('birthDateDisplay').textContent = decoded.birthDate || 'Non specificata';
    document.getElementById('phoneDisplay').textContent = decoded.phone || 'Non specificato';
    document.getElementById('createdAtDisplay').textContent = new Date(decoded.createdAt).toLocaleDateString();

    const profileView = document.getElementById('profileView');
    const profileEditForm = document.getElementById('profileEditForm');
    const passwordChangeForm = document.getElementById('passwordChangeForm');

    // Modifica profilo
    document.getElementById('editProfileButton').addEventListener('click', () => {
        profileView.classList.add('d-none');
        profileEditForm.classList.remove('d-none');

        // Precompila i campi del modulo
        document.getElementById('name').value = decoded.name || '';
        document.getElementById('favoriteHero').value = decoded.favoriteHero || '';
        document.getElementById('birthDate').value = decoded.birthDate || '';
        document.getElementById('phone').value = decoded.phone || '';
    });

    document.getElementById('cancelEditButton').addEventListener('click', () => {
        profileEditForm.classList.add('d-none');
        profileView.classList.remove('d-none');
    });

    profileEditForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const updatedData = {
            name: document.getElementById('name').value,
            favoriteHero: document.getElementById('favoriteHero').value,
            birthDate: document.getElementById('birthDate').value,
            phone: document.getElementById('phone').value,
        };
    
        try {
            const response = await fetch('http://localhost:5000/api/auth/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });
    
            if (!response.ok) {
                console.error('Errore nella risposta:', response);
                alert(`Errore: ${response.status} ${response.statusText}`);
                return;
            }
    
            const data = await response.json();
    
            alert('Profilo aggiornato con successo!');
            location.reload();
        } catch (error) {
            console.error('Errore durante l\'aggiornamento del profilo:', error);
            alert('Errore di connessione o server non raggiungibile.');
        }
    });
    

    // Modifica password
    document.getElementById('changePasswordButton').addEventListener('click', () => {
        profileView.classList.add('d-none');
        passwordChangeForm.classList.remove('d-none');
    });

    document.getElementById('cancelPasswordChangeButton').addEventListener('click', () => {
        passwordChangeForm.classList.add('d-none');
        profileView.classList.remove('d-none');
    });

    passwordChangeForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmNewPassword) {
            alert('La nuova password e la conferma non coincidono.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Password cambiata con successo!');
                passwordChangeForm.classList.add('d-none');
                profileView.classList.remove('d-none');
            } else {
                alert(`Errore: ${data.message}`);
            }
        } catch (error) {
            console.error('Errore durante la modifica della password:', error);
            alert('Si è verificato un errore. Riprova più tardi.');
        }
    });

    // Elimina account
    document.getElementById('deleteAccountButton').addEventListener('click', async () => {
        if (!confirm('Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.')) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/delete', {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert('Account eliminato con successo!');
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            } else {
                alert(`Errore: ${data.message}`);
            }
        } catch (error) {
            console.error('Errore durante l\'eliminazione dell\'account:', error);
            alert('Si è verificato un errore. Riprova più tardi.');
        }
    });
});
