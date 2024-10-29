import jwt from 'jsonwebtoken';

const SECRET_KEY = 'secret key'; // Ensure this matches the one in your controller

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token is not valid' });
        }
        req.userId = decoded.userid; // Save the user ID from the token for later use
        next();
    });
};

export default authMiddleware;
