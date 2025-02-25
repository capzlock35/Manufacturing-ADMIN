import Admin from "../model/adminModel.js"; // ADDED .js
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret-key';

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createUser = async (req, res) => {
    try {
        console.log("createUser called");

        const { userName, email, password, confirmPassword,firstName, lastName, birthday, gender ,role } = req.body;

        if (!req.files || !req.files.image) {
            console.log("No image found in req.files");
            return res.status(400).json({ message: "Image is required"});
        }

        const image = req.files.image;
        console.log("image", image);

        if(!userName || !email || !password || !confirmPassword || !firstName || !lastName || !birthday || !gender || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match"});
        }

        //Convert the Buffer to a base64 string
        const base64Image = `data:${image.mimetype};base64,${image.data.toString('base64')}`;

        let uploadedImage;
        try {
            console.log("Uploading to Cloudinary...");
            uploadedImage = await cloudinary.uploader.upload(base64Image, {
                folder: "Admin",
            });
            console.log("Cloudinary upload successful", uploadedImage);
        } catch (cloudinaryError) {
            console.error("Cloudinary Error:", cloudinaryError);
            return res.status(500).json({ message: "Error uploading image to Cloudinary", error: cloudinaryError.message });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Admin({
            userName,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            birthday,
            gender,
            role,
            image: {
                public_id: uploadedImage.public_id,
                secure_url: uploadedImage.secure_url,
            },
        });

        await newUser.save();

        return res.status(201).json({  // Added return
            message: "Account created successfully",
            user: {
                userName,
                email,
                firstName,
                lastName,
                birthday,
                gender,
                role,
                imageUrl: uploadedImage.secure_url,
            },
        });

    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({ message: "Error creating account", error: error.message });
    }
};

export const getAllUser = async (req, res) => {
    try {
        const users = await Admin.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting all users:", error);
        res.status(500).json({ message: "Error getting all users", error: error.message});
    }
};

export const updateUser = async (req, res) =>{
    try {
        const { id } = req.params;
        const { userName, email, firstName, lastName, birthday, gender, role } = req.body;

        const user = await Admin.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.userName = userName || user.userName;
        user.email = email || user.email;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.birthday = birthday || user.birthday;
        user.gender = gender || user.gender;
        user.role = role || user.role;

        const updatedUser = await user.save();

        return res.status(200).json({ message: "User updated succesfully", user: updatedUser }); //Added return and res
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

export const viewUser = async(req,res) => {
    try{
        const userId = req.params.id;
        const user = await Admin.findById(userId); // Changed User to Admin
        if (!user){
            return res.status(404).json({ error: 'Invalid User' }) // Changed status code and message
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error viewing user:", error);
        res.status(500).json({ error: 'Error viewing user' })
    }
}

export const viewProfile = async (req, res) => {
    try {
        const userId = req.params.id; //THIS LINE IS CRITICAL
        const user = await Admin.findById(userId); // Changed User to Admin
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error viewing profile:", error);
        res.status(500).json({ error: 'Failed to retrieve profile' });
    }
};


export const getUsernameForAnnouncement = async (req, res) => {
    try {
      const userId = req.params.id; // Get the user ID from the URL params
      const user = await Admin.findById(userId).select('userName'); // Select ONLY userName
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ username: user.userName }); // Send the username in the response
    } catch (error) {
      console.error("Error getting username for announcement:", error);
      res.status(500).json({ error: 'Failed to retrieve username' });
    }
  };

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Admin.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if the role is either 'admin', 'staff', or 'superadmin'
        if (user.role !== 'admin' && user.role !== 'staff' && user.role !== 'superadmin') {
            return res.status(403).json({ error: 'Unauthorized role' }); // 403 Forbidden for unauthorized roles
        }

        // Sign JWT token, include user ID and role in the payload
        const token = jwt.sign(
            { userid: user._id, role: user.role },
            SECRET_KEY,
            { expiresIn: '1hr' }
        );
        console.log("User ID: " + user._id);
        res.json({
            message: 'Login successful',
            token,
            role: user.role,
            userid: user._id, // Add the user ID to the response
            userName: user.userName //**ADD THIS LINE HERE userName: user.userName,**
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: 'Error logging in' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await Admin.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the image from Cloudinary
        if (deletedUser.image && deletedUser.image.public_id) { //CHECK IF IMAGE EXISTS
            try {
                await cloudinary.uploader.destroy(deletedUser.image.public_id);
            } catch (cloudinaryError) {
                console.error("Error deleting image from Cloudinary:", cloudinaryError);
                // Consider whether to fail the whole operation if Cloudinary deletion fails, or just log the error
            }
        }

        console.log('Deleted in the backend');

        res.status(200).json({ message: "User deleted successfully", user: deletedUser });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};