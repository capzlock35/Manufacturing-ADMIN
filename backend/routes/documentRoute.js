import express from 'express';
import { createDocument, getAllDocuments, viewDocument, updateDocument, deleteDocument } from '../controller/documentController.js';

const documentRouter = express.Router();

// Route to fetch all documents (accessible to all)
documentRouter.get('/get', getAllDocuments);

// Route to create a new document (no authentication required)
documentRouter.post('/create', createDocument);

// Route to view a specific document by ID (accessible to all)
documentRouter.get('/view/:id', viewDocument);

// Route to update a document by ID (no authentication required)
documentRouter.put('/update/:id', updateDocument);

// Route to delete a document by ID (no authentication required)
documentRouter.delete('/delete/:id', deleteDocument);

export default documentRouter;
