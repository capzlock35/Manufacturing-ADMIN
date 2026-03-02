import express from 'express';
import {
    getMessagesByChannel,
    createMessage,
} from '../controller/messageController.js'; // Import controllers

const router = express.Router();

// GET messages for a specific channel
router.get('/channel/:channelId', getMessagesByChannel);

// POST a new message to a channel
router.post('/', createMessage);

export default router; // Export router