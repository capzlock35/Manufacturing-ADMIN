import CoreUser from "../model/coreModel.js";
import bcrypt from 'bcryptjs';

// --- Existing Functions (Mostly Unchanged) ---

// Get ALL users (regardless of status)
const getAllUser = async (req, res) => {
    try {
        const users = await CoreUser.find(); // Gets all users
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting all users:", error);
        res.status(500).json({ message: "Failed to retrieve users" });
    }
};

// Create User (Defaults to 'active' status via schema)
const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, Core, role } = req.body;

        const existingUser = await CoreUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new CoreUser({
            name,
            email,
            password: hashedPassword,
            Core: Core,
            role: role
            // status defaults to 'active' from schema
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error) {
        console.error("Error creating user:", error);
        let errorMessage = "Failed to create user";
        if (error.name === 'ValidationError') {
             errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
             return res.status(400).json({ message: errorMessage });
        }
        res.status(500).json({ message: errorMessage });
    }
};

// View User by ID (Includes status)
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

// View User Profile (Includes status)
const viewProfile = async (req, res) => {
    try {
        const userId = req.userId; // Assuming authMiddleware provides this
        const user = await CoreUser.findById(userId).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user); // Includes status

    } catch (error) {
        console.error("Error viewing profile:", error);
        res.status(500).json({ message: "Failed to view profile" });
    }
};

// Update User by ID (Can update any field including status)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, Core, role, status } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (Core) updateData.Core = Core;
        if (role) updateData.role = role;
        if (status && ["active", "inactive"].includes(status)) {
             updateData.status = status;
        }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (Object.keys(updateData).length === 0) {
             return res.status(400).json({ message: "No update data provided" });
        }

        const updatedUser = await CoreUser.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });

    } catch (error) {
        console.error("Error updating user:", error);
        let errorMessage = "Failed to update user";
        if (error.name === 'ValidationError') {
             errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
             return res.status(400).json({ message: errorMessage });
        }
        if (error.code === 11000) {
             return res.status(400).json({ message: "Email already in use." });
        }
        res.status(500).json({ message: errorMessage, error: error.message });
    }
};

// --- ORIGINAL deleteUser (Hard Delete - Permanent Removal) ---
const deleteUser = async (req, res) => {
  console.log("deleteUser function called (PERMANENTLY REMOVING)!");
  try {
      const { id } = req.params;
      console.log("Permanently deleting user with ID:", id);

      // Find the user by ID and PERMANENTLY delete
      const deletedUser = await CoreUser.findByIdAndDelete(id);

      if (!deletedUser) {
          console.log("User not found for deletion!");
          return res.status(404).json({ message: "User not found" });
      }

      console.log("User permanently deleted from database:", deletedUser);
      res.status(200).json({ message: "User permanently deleted successfully", user: deletedUser });

  } catch (error) {
      console.error("Error permanently deleting user:", error);
      res.status(500).json({ message: "Error permanently deleting user", error: error.message });
  }
};


// --- NEW Functions for Status Management ---

// Deactivate User (Set status to 'inactive' - Soft Remove)
const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deactivating user with ID:", id);

        const updatedUser = await CoreUser.findByIdAndUpdate(
            id,
            { status: 'inactive' },
            { new: true } // Return the updated document
        ).select('-password'); // Exclude password from response

        if (!updatedUser) {
            console.log("User not found for deactivation!");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User status set to inactive:", updatedUser);
        res.status(200).json({ message: "User deactivated successfully", user: updatedUser });

    } catch (error) {
        console.error("Error deactivating user:", error);
        res.status(500).json({ message: "Error deactivating user", error: error.message });
    }
};

// Reactivate User (Set status to 'active' - Undo Soft Remove)
const reactivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Reactivating user with ID:", id);

        const updatedUser = await CoreUser.findByIdAndUpdate(
            id,
            { status: 'active' },
            { new: true } // Return the updated document
        ).select('-password'); // Exclude password from response

        if (!updatedUser) {
            console.log("User not found for reactivation!");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User status set to active:", updatedUser);
        res.status(200).json({ message: "User reactivated successfully", user: updatedUser });

    } catch (error) {
        console.error("Error reactivating user:", error);
        res.status(500).json({ message: "Error reactivating user", error: error.message });
    }
};

// Get only ACTIVE users
const getActiveUsers = async (req, res) => {
    try {
        const activeUsers = await CoreUser.find({ status: 'active' }).select('-password'); // Find only active users
        res.status(200).json(activeUsers);
    } catch (error) {
        console.error("Error getting active users:", error);
        res.status(500).json({ message: "Failed to retrieve active users" });
    }
};

// Get only INACTIVE users
const getInactiveUsers = async (req, res) => {
    try {
        const inactiveUsers = await CoreUser.find({ status: 'inactive' }).select('-password'); // Find only inactive users
        res.status(200).json(inactiveUsers);
    } catch (error) {
        console.error("Error getting inactive users:", error);
        res.status(500).json({ message: "Failed to retrieve inactive users" });
    }
};


// --- Update Exports ---
export {
    getAllUser,
    createUser,
    viewUser,
    viewProfile,
    updateUser,
    deleteUser, // Original hard delete
    deactivateUser, // New soft delete
    reactivateUser, // New undo soft delete
    getActiveUsers, // New get active only
    getInactiveUsers // New get inactive only
};