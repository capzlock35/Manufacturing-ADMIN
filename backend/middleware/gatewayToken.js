import jwt from 'jsonwebtoken'

const generateGatewayToken = () => {
    const payload = { service: 'Admin' };
    return jwt.sign(payload, process.env.GATEWAY_JWT_SECRET, { expiresIn: '10m' });
};

export default generateGatewayToken