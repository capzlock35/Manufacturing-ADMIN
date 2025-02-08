import mongoose from 'mongoose';

const requestResourceSchema = new mongoose.Schema({
    name: { type: String, required: true },        // Staff member's name
    resourceName: { type: String, required: true }, // Name of the requested resource
    type: { type: String, required: true, enum: ['Equipment', 'Tool', 'Material', 'Other'] },
    description: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true },
    allocatedTo: { type: String, required: true },
    requestDate: { type: Date, default: Date.now },
    status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] }, // Corrected enum values
    requestingUser: { type: String }, // Staff who made the request - can store id if have auth
});

const RequestResource = mongoose.model('RequestResource', requestResourceSchema, 'requestresources'); // Explicit collection name

export default RequestResource;