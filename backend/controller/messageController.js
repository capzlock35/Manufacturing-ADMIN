import Message from '../model/Message.js'; // Import using .js extension

// Get messages for a specific channel
export const getMessagesByChannel = async (req, res) => {
    try {
        const messages = await Message.find({ channelId: req.params.channelId })
                                      .sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new message
export const createMessage = async (req, res) => {
    const message = new Message({
        channelId: req.body.channelId,
        userId: req.body.userId,
        username: req.body.username,
        content: req.body.content,
    });

    try {
        const newMessage = await message.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};