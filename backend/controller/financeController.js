// controller/financeController.js
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import Finance from '../model/financeModel.js'; // Import the Finance model

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Controller for creating a new Finance user with image upload
export const createUser = async (req, res) => {
    try {
        console.log("createUser called");

        const { userName, password, confirmPassword, email, fullName, role } = req.body;
        console.log("req.body", req.body);

        if (!req.files || !req.files.image) {
            console.log("No image found in req.files");
            return res.status(400).json({ message: "Image is required" });
        }
        const image = req.files.image;
        console.log("image", image);

        if (!userName || !password || !confirmPassword || !email || !fullName || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Convert the Buffer to a base64 string
        const base64Image = `data:${image.mimetype};base64,${image.data.toString('base64')}`;

        let uploadedImage;
        try {
            console.log("Uploading to Cloudinary...");
            uploadedImage = await cloudinary.uploader.upload(base64Image, {
                folder: "Finance",
            });
            console.log("Cloudinary upload successful", uploadedImage);
        } catch (cloudinaryError) {
            console.error("Cloudinary Error:", cloudinaryError);
            return res.status(500).json({ message: "Error uploading image to Cloudinary", error: cloudinaryError.message });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Finance({
            userName,
            password: hashedPassword,
            email,
            fullName,
            role,
            image: {
                public_id: uploadedImage.public_id,
                secure_url: uploadedImage.secure_url,
            },
        });

        await newUser.save();

        res.status(201).json({
            message: "Account created successfully",
            user: {
                userName,
                email,
                fullName,
                role,
                imageUrl: uploadedImage.secure_url,
            },
        });

    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({ message: "Error creating account", error: error.message });
    }
};

// Placeholder functions for other routes
export const getAllUsers = async (req, res) => {
    try {
        const users = await Finance.find(); // Fetch all finance users from the database
        res.status(200).json(users); // Send the users as JSON response
    } catch (error) {
        console.error("Error getting all users:", error);
        res.status(500).json({ message: "Error getting all users", error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { userName, email, fullName, role } = req.body; // Extract the fields you want to update

        // Find the user by ID
        const user = await Finance.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's fields
        user.userName = userName || user.userName;
        user.email = email || user.email;
        user.fullName = fullName || user.fullName;
        user.role = role || user.role;

        // Save the updated user
        const updatedUser = await user.save();

        // Respond with the updated user
        res.status(200).json({ message: "User updated successfully", user: updatedUser });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

export const viewUser = async (req, res) => { // ADD export
  res.status(200).json({ message: "View user" });
};

export const viewProfile = async (req, res) => { // ADD export
  res.status(200).json({ message: "View profile" });
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by ID and delete
        const deletedUser = await Finance.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log('Deleted in the backend');

        // Respond with a success message
        res.status(200).json({ message: "User deleted successfully", user: deletedUser });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};