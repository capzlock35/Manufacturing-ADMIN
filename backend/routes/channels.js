// routes/channels.js
import express from 'express';
import {
    getAllChannels,
    createChannel,
    getChannel,
    getChannelById,
    deleteChannelById, // Import new controller function
    updateChannelById, // Import new controller function
} from '../controller/channelController.js'; // Import controllers

const router = express.Router();

// GET all channels
router.get('/', getAllChannels);

// POST a new channel
router.post('/', createChannel);

// GET a specific channel
router.get('/:id', getChannel, getChannelById);

// DELETE a channel by ID
router.delete('/:id', getChannel, deleteChannelById); // Use getChannel middleware to validate channel existence

// PUT/PATCH to update a channel by ID (using PUT for simplicity, PATCH is also fine)
router.put('/:id', getChannel, updateChannelById); // Use getChannel middleware

export default router;