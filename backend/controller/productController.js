import { v2 as cloudinary } from 'cloudinary';
import Product from '../model/productModel.js';

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Controller to create a new product with image upload
export const createProduct = async (req, res) => {
    try {
        console.log("createProduct called");
        console.log("req.body", req.body);

        if (!req.files || !req.files.image) {
            console.log("No image found in req.files");
            return res.status(400).json({ message: "Image is required" });
        }

        console.log("req.files", req.files);

        const image = req.files.image;

        if (!image.mimetype.startsWith('image/')) {
            return res.status(400).json({ message: "Only images are allowed" });
        }
        const { productName, description, price } = req.body;

        if (!productName || !description || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Convert the Buffer to a base64 string
        // Upload using a temp file is more performant for large files.

        let uploadedImage;
        try {
            const base64Image = `data:${image.mimetype};base64,${image.data.toString('base64')}`;

            console.log("Uploading to Cloudinary...");
            uploadedImage = await cloudinary.uploader.upload(base64Image, {
                folder: "Products", // Folder name in Cloudinary
            });
            console.log("Cloudinary upload successful", uploadedImage);
        } catch (cloudinaryError) {
            console.error("Cloudinary Error:", cloudinaryError);
            return res.status(500).json({ message: "Error uploading image to Cloudinary", error: cloudinaryError.message });
        }

        // Create a new product
        const newProduct = new Product({
            productName,
            description,
            price,
            image: {
                public_id: uploadedImage.public_id,
                secure_url: uploadedImage.secure_url,
            },
        });

        // Save the product to the database
        await newProduct.save();

        res.status(201).json({
            message: "Product created successfully",
            product: newProduct,
        });

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

// Controller to get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from the database
        res.status(200).json(products); // Send the products as JSON response
    } catch (error) {
        console.error("Error getting all products:", error);
        res.status(500).json({ message: "Error getting all products", error: error.message });
    }
};


// Controller to delete a product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID and delete
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        console.log('Deleted in the backend');

        // Respond with a success message
        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};