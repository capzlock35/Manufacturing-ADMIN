import express from 'express';
import serviceteGatewayToken from '../middleware/serviceToken.js';
import generateServiceToken from '../middleware/gatewayToken.js';

const router = express.Router();

router.get('/get-token', (req, res) => {
    try {
        const token = serviceteGatewayToken();
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error generating token", error: error.message });
    }
});

router.get('/get-tokenG', (req, res) => {
    try {
        const token = generateServiceToken();
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error generating token", error: error.message });
    }
});


export default router;
