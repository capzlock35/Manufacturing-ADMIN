import CoreUser from "../model/coreModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'BOSSING';

// Get all users
const getAllUser = async (req, res) => {
    try {
        const users = await CoreUser.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ message: "Failed to retrieve users" });
    }
};


// Create User
const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Check if user already exists
        const existingUser = await CoreUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Password validation
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new CoreUser({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user
        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Failed to create user" });
    }
};

// Login
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await CoreUser.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create token
        const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful", token: token });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Login failed" });
    }
};

// View User by ID
const viewUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await CoreUser.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error("Error viewing user:", error);
        res.status(500).json({ message: "Failed to view user" });
    }
};

// View User Profile (Requires Authentication)
const viewProfile = async (req, res) => {
    try {
        // The authMiddleware should have already placed the user's ID on the request object
        const userId = req.userId;

        const user = await CoreUser.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user profile (excluding the password for security)
        const userProfile = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        res.status(200).json(userProfile);

    } catch (error) {
        console.error("Error viewing profile:", error);
        res.status(500).json({ message: "Failed to view profile" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by ID and delete
        const deletedUser = await CoreUser.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Respond with a success message
        res.status(200).json({ message: "User deleted successfully", user: deletedUser });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

export { getAllUser, createUser, Login, viewUser, viewProfile, deleteUser };