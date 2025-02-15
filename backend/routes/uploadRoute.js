import express from "express";
import fileUpload from "express-fileupload";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Enable file upload middleware
router.use(fileUpload());

router.post("/", async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const file = req.files.image;

        // Upload image to Cloudinary using buffer
        const result = await cloudinary.uploader.upload_stream({ folder: "uploads" }, 
            (error, result) => {
                if (error) return res.status(500).json({ message: "Upload failed", error });

                res.status(200).json({
                    message: "Image uploaded successfully",
                    imageUrl: result.secure_url,
                });
            }
        ).end(file.data); // Send file buffer

    } catch (error) {
        res.status(500).json({ message: "Upload failed", error });
    }
});

export default router;
