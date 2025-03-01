import { v2 as cloudinary } from 'cloudinary';
import { BenefitDocument } from '../model/BenefitDocument.js'; // **Corrected import - named import**

// Configure Cloudinary (if not already globally configured)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Controller function to upload benefit document (direct Cloudinary upload)
const uploadBenefitDocument = async (req, res) => {
  try {
    // 1. Check if file data and description are provided
    if (!req.body.fileData || !req.body.description) {
      return res.status(400).json({ message: 'Please provide file data (fileData) and a description.' });
    }

    const fileData = req.body.fileData; // Assuming file data is sent in req.body.fileData
    const description = req.body.description;

    // 2.  Basic check if fileData is present (you might need more robust validation depending on how you send fileData from frontend)
    if (!fileData) {
      return res.status(400).json({ message: 'No file data provided.' });
    }

    // 3. Upload to Cloudinary directly using fileData
    cloudinary.uploader.upload(
      fileData, // Pass the file data directly (could be base64 string, buffer, or file path)
      {
        resource_type: 'raw', // Important for PDF uploads
        folder: 'benefit-documents', // Optional: Organize in Cloudinary folders
        public_id: `${Date.now()}-document`, // Optional: Customize public ID
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return res.status(500).json({ message: 'Error uploading file to Cloudinary.' });
        }

        // 4. Save document details to MongoDB
        try {
          const newBenefitDocument = new BenefitDocument({
            documentFile: result.secure_url, // URL from Cloudinary
            description: description,
          });
          await newBenefitDocument.save();

          return res.status(201).json({
            message: 'Benefit document uploaded successfully.',
            document: newBenefitDocument,
          });
        } catch (dbError) {
          console.error('Database Save Error:', dbError);
          return res.status(500).json({ message: 'Error saving document details to database.' });
        }
      }
    );
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({ message: 'Server error while uploading benefit document.' });
  }
};

const getAllBenefitDocuments = async (req, res) => {
    try {
      const documents = await BenefitDocument.find().sort({ createdAt: -1 }); // Fetch all documents, newest first
      res.status(200).json(documents);
    } catch (error) {
      console.error('Error fetching benefit documents:', error);
      res.status(500).json({ message: 'Error fetching benefit documents from database.' });
    }
  };

  export { uploadBenefitDocument, getAllBenefitDocuments };