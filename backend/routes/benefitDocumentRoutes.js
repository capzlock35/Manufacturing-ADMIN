// benefitDocumentRoutes.js
import express from 'express';
import { uploadBenefitDocument, getAllBenefitDocuments } from '../controller/benefitDocumentController.js'; // Adjust path if needed

const router = express.Router();

// Route for uploading a benefit document (PDF) - Direct Cloudinary upload
router.post('/', uploadBenefitDocument); // Route path is '/'

// Route to get all benefit documents
router.get('/', getAllBenefitDocuments); // Route path is '/'

export default router;