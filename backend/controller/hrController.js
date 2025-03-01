
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
// Create User
const createUser = async (req, res) => {
    try {
        // Include position in destructuring
        const { firstName, lastName, email, password, confirmPassword, role, Hr, position } = req.body;

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
            role,
            Hr, // Include Hr in the user object
            position // Include position in the user object  <--- ADDED POSITION HERE
        });

        // Save the user
        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Failed to create user" ,error:error.message});
    }
};


//Delete User
//Delete User
const deleteUser = async (req, res) => {
    console.log("deleteUser function called!");  // Add this log

    try {
        const { id } = req.params;
        console.log("Deleting user with ID:", id); // Log the ID

        // Find the user by ID and delete
        const deletedUser = await Hruser.findByIdAndDelete(id);

        if (!deletedUser) {
            console.log("User not found!"); // Log if user isn't found
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User deleted successfully from database:", deletedUser);  // Log success
        // Respond with a success message
        res.status(200).json({ message: "User deleted successfully", user: deletedUser });

    } catch (error) {
        console.error("Error deleting user:", error);  // Log the full error
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // Get the user ID from the URL
        // Include position in destructuring
        const { firstName, lastName, email, role, Hr, position } = req.body; // Get the updated data from the request body

        // Find the user by ID
        const user = await Hruser.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.role = role || user.role;
        user.Hr = Hr || user.Hr;
        user.position = position || user.position; // Update position if provided  <-- ADDED POSITION HERE

        // Save the updated user
        const updatedUser = await user.save();

        res.status(200).json({ message: "User updated successfully", user: updatedUser });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
};

export { getAllUser, createUser, deleteUser, updateUser };