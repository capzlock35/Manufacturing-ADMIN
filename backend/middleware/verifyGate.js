// VERIFY TOKEN FROM API GATEWAY
import jwt from 'jsonwebtoken'

const verifyGate = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.GATEWAY_JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.decoded = decoded;
    next();
  });
};

export default verifyGate;