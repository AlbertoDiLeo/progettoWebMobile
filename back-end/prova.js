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