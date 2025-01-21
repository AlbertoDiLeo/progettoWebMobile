const bcrypt = require('bcryptjs');

async function generateAndTestPassword() {
    const plainPassword = 'ciaobello'; // Password inserita

    // Genera l'hash della password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log('Password crittografata:', hashedPassword);

    // Confronta la password in chiaro con l'hash generato
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Confronto manuale con bcryptjs:', isValid);
}

generateAndTestPassword();



/*router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Dati ricevuti per il login:', { email, password });

        // Trova l'utente
        const user = await User.findOne({ email });
        if (!user) {
            console.error('Errore: Utente non trovato.');
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        console.log('Utente trovato:', user);

        // Verifica la password
        try {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('Confronto password:', {
                inserita: password,
                salvata: user.password,
                valida: isPasswordValid,
            });

            if (!isPasswordValid) {
                console.error('Errore: Password errata.');
                return res.status(401).json({ message: 'Password errata' });
            }

            console.log('Password verificata con successo.');

            // Genera il token JWT
            const token = jwt.sign(
                { id: user._id, name: user.name, email: user.email, favoriteHero: user.favoriteHero },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            console.log('Token generato:', token);

            res.status(200).json({ token, message: 'Login riuscito' });
        } catch (compareError) {
            console.error('Errore durante il confronto delle password:', compareError.message);
            return res.status(500).json({ message: 'Errore durante il confronto delle password' });
        }
    } catch (err) {
        console.error('Errore durante il login:', err.message);
        res.status(500).json({ message: 'Errore durante il login', error: err.message });
    }
});*/