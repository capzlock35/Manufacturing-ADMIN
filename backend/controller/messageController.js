// controller/messageController.js
import Message from '../model/Message.js';

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 }); // Fetch and sort
        res.status(200).json(messages); // Send JSON array response
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error: error.message });
    }
};

export const createMessage = async (req, res) => {
    const { username, message } = req.body;

    if (!username || !message) {
        return res.status(400).json({ message: "Username and message are required" });
    }

    try {
        const newMessage = new Message({ username, message });
        const savedMessage = await newMessage.save();

        // WebSocket broadcasting is handled in server.js
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ message: "Error creating message", error: error.message });
    }
};