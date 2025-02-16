import Hruser from "../model/hrModel.js";
import bcrypt from 'bcryptjs';


// Get all users
const getAllUser = async (req, res) => {
    try {
        const users = await Hruser.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ message: "Failed to retrieve users" });
    }
};


// Create User
const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, role } = req.body;

        // Check if user already exists
        const existingUser = await Hruser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Password validation on backend
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new Hruser({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role
        });

        // Save the user
        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Failed to create user" });
    }
};

//Delete User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by ID and delete
        const deletedUser = await Hruser.findByIdAndDelete(id);

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

export { getAllUser, createUser, deleteUser };