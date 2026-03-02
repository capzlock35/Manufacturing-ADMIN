import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  resourceName: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['Equipment', 'Tool', 'Material', 'Other'] },
  description: { type: String },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true },
  allocatedTo: { type: String, required: true },
  assignedDate: { type: Date, default: Date.now }, // Automatically set when resource is created
  completedDate: { type: Date, required: true },      // Date when resource is needed/completed
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;