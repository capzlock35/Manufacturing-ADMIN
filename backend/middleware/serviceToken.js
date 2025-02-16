import jwt from 'jsonwebtoken'

const generateServiceToken = () => {
    const payload = { service: 'Admin' };
    return jwt.sign(payload, process.env.SERVICE_JWT_SECRET, { expiresIn: '10m' });
};

export default generateServiceToken;