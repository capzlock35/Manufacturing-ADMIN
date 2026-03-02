import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    text: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const TaskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    dueDate: {
      type: Date,
      required: true
    },
    dateCreated: {
      type: Date,
      default: Date.now
    },
    completed: {
      type: Boolean,
      default: false
    },
    notes: [NoteSchema] // Embed the NoteSchema here
  });

export default mongoose.model('Task', TaskSchema);