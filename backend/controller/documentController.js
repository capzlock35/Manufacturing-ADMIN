import Document from "../model/documentModel.js";
import cloudinary from 'cloudinary';
import "dotenv/config";
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Store files in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);  // Unique filename
    }
});

const upload = multer({ storage: storage });

// Configure Cloudinary (put this at the top of your controller)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to add a tracking event
const addTrackingEvent = async (documentId, message) => {
    try {
        const document = await Document.findById(documentId);
        if (!document) {
            console.error("Document not found when adding tracking event");
            return;
        }

        document.tracking.push({ message });  // Add the new event
        await document.save();                // Save the updated document
    } catch (error) {
        console.error("Error adding tracking event:", error);
    }
};


// Create a new document
const createDocument = async (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ error: 'File upload error: ' + err.message });
    }

    try {
      const { title, date, category, status, description } = req.body;
      let attachmentName = '';
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "documents",
            resource_type: "auto"
          });
          attachmentName = result.secure_url;
          // Delete the temporary file (optional, but good practice)
          fs.unlinkSync(req.file.path);
        } catch (cloudinaryErr) {
          console.error("Cloudinary error:", cloudinaryErr);
          return res.status(500).json({ error: 'Cloudinary upload error: ' + cloudinaryErr.message });
        }
      }

      const document = new Document({
        title,
        date,
        category,
        status,
        description,
        attachmentName
      });

      await document.save();
      await addTrackingEvent(document._id, `Document "${title}" created.`);
      res.status(201).json({ message: 'Document created successfully', document });
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ error: 'Error creating document: ' + error.message });
    }
  });
};

// Get all documents - NO PAGINATION
const getAllDocuments = async (req, res) => {
    try {
        const searchQuery = req.query.search || '';
        // Search query filter
        const query = {
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { category: { $regex: searchQuery, $options: 'i' } }
            ]
        };

        const documents = await Document.find(query);

        res.status(200).json(documents); // just send documents

    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ error: 'Unable to fetch documents' });
    }
};

// View a document by ID
const viewDocument = async (req, res) => {
    try {
        const documentId = req.params.id;
        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(200).json(document); // Return the full document including tracking

    } catch (error) {
        console.error("Error viewing document:", error);
        res.status(500).json({ error: 'Error viewing document' });
    }
};

// Update a document
const updateDocument = async (req, res) => {
   upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ error: 'File upload error: ' + err.message });
    }

    try {
      const documentId = req.params.id;
      const { title, date, category, status, description } = req.body;
      let attachmentName = req.body.attachmentName // to keep existing one

      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "documents",
            resource_type: "auto"
          });
          attachmentName = result.secure_url;
          // Delete the temporary file (optional, but good practice)
          fs.unlinkSync(req.file.path);
        } catch (cloudinaryErr) {
          console.error("Cloudinary error:", cloudinaryErr);
          return res.status(500).json({ error: 'Cloudinary upload error: ' + cloudinaryErr.message });
        }
      }

      const updatedDocument = await Document.findByIdAndUpdate(documentId,
        { title, date, category, status, description, attachmentName },
        { new: true }
      );

      if (!updatedDocument) {
        return res.status(404).json({ error: 'Document not found' });
      }
      await addTrackingEvent(documentId, `Document "${title}" updated.`);

      res.status(200).json(updatedDocument);  // Return the updated document
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ error: 'Failed to update document' });
    }
  });
};

// Delete a document
const deleteDocument = async (req, res) => {
    try {
        const documentId = req.params.id;

        const document = await Document.findByIdAndDelete(documentId);

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        await addTrackingEvent(documentId, `Document "${document.title}" deleted.`);


        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ error: 'Error deleting document' });
    }
};

export { createDocument, getAllDocuments, viewDocument, updateDocument, deleteDocument };