document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        showNotification('Accesso non autorizzato. Effettua il login.');
        window.location.href = 'login.html';
        return;
    }

    const decoded = jwt_decode(token);

    // Visualizza i dati utente
    document.getElementById('nameDisplay').textContent = decoded.name || '';
    document.getElementById('emailDisplay').textContent = decoded.email || '';
    document.getElementById('favoriteHeroDisplay').textContent = decoded.favoriteHero || '';
    document.getElementById('birthDateDisplay').textContent = decoded.birthDate || 'Non specificata';
    document.getElementById('phoneDisplay').textContent = decoded.phone || 'Non specificato';
    document.getElementById('createdAtDisplay').textContent = new Date(decoded.createdAt).toLocaleDateString();

    const profileView = document.getElementById('profileView');
    const profileEditForm = document.getElementById('profileEditForm');
    const passwordChangeForm = document.getElementById('passwordChangeForm');

    // Gestisce la modifica del profilo
    document.getElementById('editProfileButton').addEventListener('click', () => {
        profileView.classList.add('d-none');
        profileEditForm.classList.remove('d-none');

        document.getElementById('name').value = decoded.name || '';
        document.getElementById('favoriteHero').value = decoded.favoriteHero || '';
        document.getElementById('birthDate').value = decoded.birthDate || '';
        document.getElementById('phone').value = decoded.phone || '';
    });

    document.getElementById('cancelEditButton').addEventListener('click', () => {
        profileEditForm.classList.add('d-none');
        profileView.classList.remove('d-none');
    });

    // Salva le modifiche al profilo
    profileEditForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const updatedData = {
            name: document.getElementById('name').value,
            favoriteHero: document.getElementById('favoriteHero').value,
            birthDate: document.getElementById('birthDate').value,
            phone: document.getElementById('phone').value,
        };

        try {
            const response = await fetch('http://localhost:5000/api/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Profilo aggiornato con successo!');
                location.reload();
            } else {
                showNotification(`Errore: ${data.message}`);
            }
        } catch (error) {
            console.error('Errore durante l\'aggiornamento del profilo:', error);
            showNotification('Si è verificato un errore. Riprova più tardi.');
        }
    });

    // Gestisce la modifica della password
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
            showNotification('La nuova password e la conferma non coincidono.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Password cambiata con successo!');
                passwordChangeForm.classList.add('d-none');
                profileView.classList.remove('d-none');
            } else {
                showNotification(`Errore: ${data.message}`);
            }
        } catch (error) {
            console.error('Errore durante la modifica della password:', error);
            showNotification('Si è verificato un errore. Riprova più tardi.');
        }
    });
});
