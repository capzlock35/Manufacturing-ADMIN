import jwt from 'jsonwebtoken'

const generateGatewayToken = () => {
    const payload = { service: 'Gateway' };
    return jwt.sign(payload, process.env.GATEWAY_JWT_SECRET, { expiresIn: '10m' });
};

export default generateGatewayToken