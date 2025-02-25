// backend/controllers/announcementController.js
import Announcement from "../model/announcementModel.js";

// Create a new announcement
export const createAnnouncement = async (req, res) => { // Use export const for functions
  try {
    const { title, description, date, createdBy } = req.body;
    const newAnnouncement = new Announcement({
      title,
      description,
      date,
      createdBy,
    });
    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement', error: error.message });
  }
};

// Get all announcements
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
};

// Get announcement by ID
export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcement', error: error.message });
  }
};

// Update announcement by ID
export const updateAnnouncement = async (req, res) => {
  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body, //  <--  This will now include the 'deployed' field if sent from frontend
      { new: true, runValidators: true }
    );
    if (!updatedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(200).json(updatedAnnouncement);
  } catch (error) {
    res.status(400).json({ message: 'Error updating announcement', error: error.message });
  }
};

// Delete announcement by ID
export const deleteAnnouncement = async (req, res) => {
  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
    if (!deletedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
};