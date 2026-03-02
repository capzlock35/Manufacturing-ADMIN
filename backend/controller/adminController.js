// controller/adminController.js
import Admin from "../model/adminModel.js";
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import LoginLog from '../model/loginLogModel.js';
import axios from 'axios'; // <-- Import axios

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret-key';
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY; // <-- Your Secret Key from .env

// Cloudinary config (keep as is)
// ... (cloudinary config remains the same) ...

// --- createUser, getAllUser, updateUser, viewUser, viewProfile, getUsernameForAnnouncement remain the same ---
// ... (paste the existing code for these functions here) ...
export const createUser = async (req, res) => {
    try {
        console.log("createUser called");

        const { userName, email, password, confirmPassword, firstName, lastName, birthday, gender, role } = req.body;

        // Check if username or email already exists
        const existingUser = await Admin.findOne({ $or: [{ userName }, { email }] });
        if (existingUser) {
             let message = "Username or email already exists.";
             if (existingUser.userName === userName && existingUser.email === email) {
                 message = "Username and email already exist.";
             } else if (existingUser.userName === userName) {
                 message = "Username already exists.";
             } else {
                 message = "Email already exists.";
             }
             return res.status(400).json({ message });
        }


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
            status: 'active' // Explicitly set status, though schema default handles this
        });

        await newUser.save();

        return res.status(201).json({
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
                status: newUser.status // Include status in response
            },
        });

    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({ message: "Error creating account", error: error.message });
    }
};
export const getAllUser = async (req, res) => {
    try {
        // Fetch only users where status is 'active'
        const users = await Admin.find({ status: 'active' });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting all active users:", error);
        res.status(500).json({ message: "Error getting all active users", error: error.message});
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

        // Optional: Check if updated username/email conflicts with *other* users
         if (userName && userName !== user.userName) {
             const existingUser = await Admin.findOne({ userName });
             if (existingUser && existingUser._id.toString() !== id) {
                 return res.status(400).json({ message: "Username already exists." });
             }
         }
         if (email && email !== user.email) {
             const existingUser = await Admin.findOne({ email });
             if (existingUser && existingUser._id.toString() !== id) {
                 return res.status(400).json({ message: "Email already exists." });
             }
         }


        user.userName = userName || user.userName;
        user.email = email || user.email;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.birthday = birthday || user.birthday;
        user.gender = gender || user.gender;
        user.role = role || user.role;

        const updatedUser = await user.save();

        return res.status(200).json({ message: "User updated succesfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};
export const viewUser = async(req,res) => {
    try{
        const userId = req.params.id;
        // Find user including inactive ones for viewing specific user details
        const user = await Admin.findById(userId);
        if (!user){
            return res.status(404).json({ error: 'User not found' })
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error viewing user:", error);
        res.status(500).json({ error: 'Error viewing user' })
    }
};
export const viewProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Admin.findById(userId);
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
      const userId = req.params.id;
      const user = await Admin.findById(userId).select('userName');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ username: user.userName });
    } catch (error) {
      console.error("Error getting username for announcement:", error);
      res.status(500).json({ error: 'Failed to retrieve username' });
    }
  };


// --- UPDATED: Login controller with reCAPTCHA and status check ---
export const Login = async (req, res) => {
    try {
        const { email, password, recaptchaToken } = req.body; // <-- Destructure recaptchaToken

        // --- reCAPTCHA Verification START ---
        if (!recaptchaToken) {
            console.warn("Login attempt without reCAPTCHA token from:", email);
            return res.status(400).json({ error: 'reCAPTCHA token is missing. Please complete the challenge.' });
        }
        if (!RECAPTCHA_SECRET_KEY) {
             console.error("FATAL: RECAPTCHA_SECRET_KEY is not set in environment variables.");
             return res.status(500).json({ error: 'Server configuration error (reCAPTCHA secret missing).' });
        }

        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;

        try {
            console.log("Verifying reCAPTCHA for:", email);
            const recaptchaResponse = await axios.post(verificationURL);
            const { success, 'error-codes': errorCodes } = recaptchaResponse.data;

            if (!success) {
                console.warn("reCAPTCHA verification failed for:", email, "Errors:", errorCodes);
                // Provide a more user-friendly message, potentially logging the codes for debugging
                let errorMessage = 'reCAPTCHA verification failed. Please try again.';
                if (errorCodes?.includes('timeout-or-duplicate')) {
                    errorMessage = 'reCAPTCHA expired or already used. Please solve it again.';
                }
                return res.status(400).json({ error: errorMessage });
            }
            // If success is true, proceed with login logic
            console.log("reCAPTCHA verification successful for:", email);

        } catch (recaptchaError) {
            console.error("Error during reCAPTCHA verification call for:", email, recaptchaError);
             if (recaptchaError.response) {
                 console.error('Google API Response Data:', recaptchaError.response.data);
                 console.error('Google API Response Status:', recaptchaError.response.status);
             } else if (recaptchaError.request) {
                 console.error('No response received from Google API:', recaptchaError.request);
             } else {
                 console.error('Error setting up reCAPTCHA request:', recaptchaError.message);
             }
            return res.status(500).json({ error: 'Error verifying reCAPTCHA. Please try again later.' });
        }
        // --- reCAPTCHA Verification END ---


        // --- Existing Login Logic START ---
        const user = await Admin.findOne({ email });

        if (!user) {
            console.warn("Login attempt failed (Invalid Credentials - User not found):", email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // --- ADDED: Check User Status ---
        if (user.status !== 'active') {
             console.warn("Login attempt failed (Account Inactive):", email);
            // Use 403 Forbidden status code for inactive accounts
             return res.status(403).json({ error: 'Account is Inactive. Please contact administrator.' });
        }
        // --- END: Check User Status ---

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.warn("Login attempt failed (Invalid Credentials - Password mismatch):", email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Role Check (already exists)
        if (user.role !== 'admin' && user.role !== 'staff' && user.role !== 'superadmin') {
            console.warn("Login attempt failed (Unauthorized Role):", email, "Role:", user.role);
            return res.status(403).json({ error: 'Unauthorized role' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userid: user._id, role: user.role },
            SECRET_KEY,
            { expiresIn: '1hr' } // Adjust expiration as needed
        );

        // Record Login Log (already exists)
        try {
            await LoginLog.create({
                userName: user.userName,
                email: email, // Log the email used for login attempt
            });
            console.log("Login successful, log recorded for:", email);
        } catch (logError) {
            // Log the error but don't fail the login
            console.error("Error recording login log for:", email, logError);
        }

        // Send Success Response
        res.json({
            message: 'Login successful',
            token,
            role: user.role,
            userid: user._id,
            userName: user.userName
        });
        // --- Existing Login Logic END ---

    } catch (error) {
        // General catch block for unexpected errors
        console.error("Unexpected error during login process:", error);
        res.status(500).json({ error: 'An internal server error occurred during login.' });
    }
};


// --- removeAdminUser, undoAdminUser, fetchInactiveAdminUsers, deleteUser, getLoginLogs, changePassword remain the same ---
// ... (paste the existing code for these functions here) ...
export const removeAdminUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await Admin.findByIdAndUpdate(
            id,
            { status: 'inactive' },
            { new: true } // To return the updated document
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Admin user removed (set to inactive) successfully", user: user });

    } catch (error) {
        console.error("Error removing admin user:", error);
        res.status(500).json({ message: "Error removing admin user", error: error.message });
    }
};
export const undoAdminUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await Admin.findByIdAndUpdate(
            id,
            { status: 'active' },
            { new: true } // To return the updated document
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Admin user removal undone (set to active) successfully", user: user });

    } catch (error) {
        console.error("Error undoing admin user removal:", error);
        res.status(500).json({ message: "Error undoing admin user removal", error: error.message });
    }
};
export const fetchInactiveAdminUsers = async (req, res) => {
    try {
        const inactiveUsers = await Admin.find({ status: 'inactive' }); // Fetch only users where status is 'inactive'
        res.status(200).json(inactiveUsers);
    } catch (error) {
        console.error("Error fetching inactive admin users:", error);
        res.status(500).json({ message: "Error fetching inactive admin users", error: error.message });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await Admin.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (deletedUser.image && deletedUser.image.public_id) {
            try {
                await cloudinary.uploader.destroy(deletedUser.image.public_id);
            } catch (cloudinaryError) {
                console.error("Error deleting image from Cloudinary:", cloudinaryError);
            }
        }

        console.log('Deleted in the backend');
        res.status(200).json({ message: "User deleted successfully", user: deletedUser });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};
export const getLoginLogs = async (req, res) => {
    try {
        const logs = await LoginLog.find().sort({ loginTime: -1 });
        res.status(200).json(logs);
    } catch (error) {
        console.error("Error fetching login logs:", error);
        res.status(500).json({ error: 'Error fetching login logs' });
    }
};
export const changePassword = async (req, res) => {
    try {
        const userId = req.userid; // Assuming middleware adds userid to req
        if (!userId) {
             return res.status(401).json({ message: "Authentication required" });
        }

        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "New passwords do not match" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters long" });
        }

        // Select password explicitly as it might be excluded by default in the schema
        const user = await Admin.findById(userId).select('+password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ message: "Incorrect current password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Error changing password", error: error.message });
    }
};