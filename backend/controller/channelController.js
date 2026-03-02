import Channel from '../model/Channel.js'; // Import using .js extension

// Get all channels
export const getAllChannels = async (req, res) => {
    try {
        const channels = await Channel.find().sort({ createdAt: -1 });
        res.json(channels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new channel
export const createChannel = async (req, res) => {
    const channel = new Channel({
        name: req.body.name,
        description: req.body.description,
    });

    try {
        const newChannel = await channel.save();
        res.status(201).json(newChannel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get a specific channel (middleware)
export async function getChannel(req, res, next) {
    let channel;
    try {
        channel = await Channel.findById(req.params.id);
        if (channel == null) {
            return res.status(404).json({ message: 'Cannot find channel' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.channel = channel;
    next();
}

// Get channel by ID (route handler, using middleware)
export const getChannelById = (req, res) => {
    res.json(res.channel);
};

// Delete a channel by ID
export const deleteChannelById = async (req, res) => {
    try {
        await Channel.findByIdAndDelete(req.params.id); // Use findByIdAndDelete
        res.json({ message: 'Channel deleted successfully' }); // Respond with success message
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a channel by ID
export const updateChannelById = async (req, res) => {
    try {
        const updatedChannel = await Channel.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name, description: req.body.description }, // Allow updating name and description
            { new: true, runValidators: true } // options: return updated doc, run schema validators
        );
        res.json(updatedChannel); // Respond with the updated channel
    } catch (err) {
        res.status(400).json({ message: err.message }); // 400 for validation errors
    }
};