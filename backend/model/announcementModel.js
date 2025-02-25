// backend/models/Announcement.js
import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  createdBy: { type: String, required: true }, // Store username of creator
  createdAt: { type: Date, default: Date.now }, // Timestamp for creation
  updatedAt: { type: Date, default: Date.now }, // Timestamp for updates
  deployed: { type: Boolean, default: false }, // ADD THIS LINE - Deployed status
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;