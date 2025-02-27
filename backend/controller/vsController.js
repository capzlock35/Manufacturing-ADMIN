import VSannouncement from '../model/vsModel.js'

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await VSannouncement.find();
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createAnnouncement = async (req, res) => {
  const announcement = new VSannouncement({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    const newAnnouncement = await announcement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await VSannouncement.findById(req.params.id);
    if (req.body.title != null) {
      announcement.title = req.body.title;
    }
    if (req.body.content != null) {
      announcement.content = req.body.content;
    }
    const updatedAnnouncement = await announcement.save();
    res.json(updatedAnnouncement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await VSannouncement.findById(req.params.id);
    await announcement.remove();
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement};