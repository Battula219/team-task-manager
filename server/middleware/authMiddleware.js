const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from header (Format: Bearer <token>)
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // Verify token using your JWT_SECRET from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add the user data (id) to the request object
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = authMiddleware;