import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  resourceName: { type: String, required: true }, // ADDED THIS
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['Equipment', 'Tool', 'Material', 'Other'] }, // Restrict to specific types
  description: { type: String },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true },
  allocatedTo: { type: String, required: true },
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;  // Correct export