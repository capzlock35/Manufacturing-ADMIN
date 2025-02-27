import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const VSannouncement = mongoose.model('VSannouncement', announcementSchema);

export default VSannouncement;
