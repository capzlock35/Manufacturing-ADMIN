// model/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true // Optional: Trim whitespace from username
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;