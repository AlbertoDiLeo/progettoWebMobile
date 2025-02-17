const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.header("Authorization");
    let token;
    if (authHeader) {
        const parts = authHeader.split(" ");
        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1];
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Accesso negato: nessun token fornito" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        req.user = { userId: decoded.userId };
        next(); 
    } catch (err) {
        return res.status(403).json({ message: "Token non valido" });
    }
}

module.exports = authenticateToken;




