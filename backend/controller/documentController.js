// backend/controller/documentController.js

import Document from "../model/documentModel.js";

// Create a new document
const createDocument = async (req, res) => {
    try {
        const { title, date, category, status, description, attachmentName } = req.body;

        const document = new Document({
            title,
            date,
            category,
            status,
            description,
            attachmentName
        });

        await document.save();

        res.status(201).json({ message: 'Document created successfully', document });
    } catch (error) {
        res.status(500).json({ error: 'Error creating document' });
    }
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

        res.status(200).json({documents}); // just send documents

    } catch (error) {
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
        res.status(200).json({ document });
    } catch (error) {
        res.status(500).json({ error: 'Error viewing document' });
    }
};

// Update a document
const updateDocument = async (req, res) => {
    try {
        const documentId = req.params.id;
        const { title, date, category, status, description, attachmentName } = req.body;

        const updatedDocument = await Document.findByIdAndUpdate(documentId,
            { title, date, category, status, description, attachmentName },
            { new: true }
        );

        if (!updatedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(200).json({ message: 'Document updated successfully', updatedDocument });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update document' });
    }
};

// Delete a document
const deleteDocument = async (req, res) => {
    try {
        const documentId = req.params.id;

        const document = await Document.findByIdAndDelete(documentId);

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting document' });
    }
};

export { createDocument, getAllDocuments, viewDocument, updateDocument, deleteDocument };