import CoreUser from "../model/coreModel.js";
import bcrypt from 'bcryptjs';


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
        const { name, email, password, confirmPassword, Core, role } = req.body;

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
            Core: Core, // Add Core
            role: role //Add Role
        });

        // Save the user
        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Failed to create user" });
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
            email: user.email,
            Core: user.Core, // Added Core to the profile
            role: user.role // Added role to the profile
        };

        res.status(200).json(userProfile);

    } catch (error) {
        console.error("Error viewing profile:", error);
        res.status(500).json({ message: "Failed to view profile" });
    }
};

const deleteUser = async (req, res) => {
  console.log("deleteUser function called!");

  try {
      const { id } = req.params;
      console.log("Deleting user with ID:", id);

      // Find the user by ID and delete
      const deletedUser = await CoreUser.findByIdAndDelete(id); // **Corrected line**

      if (!deletedUser) {
          console.log("User not found!");
          return res.status(404).json({ message: "User not found" });
      }

      console.log("User deleted successfully from database:", deletedUser);
      // Respond with a success message
      res.status(200).json({ message: "User deleted successfully", user: deletedUser });

  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

// Update User by ID
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, Core, role } = req.body;

        // Check if the user exists
        const existingUser = await CoreUser.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash the password if it's being updated
        let hashedPassword = existingUser.password;  // Keep the existing password by default
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update the user
        const updatedUser = await CoreUser.findByIdAndUpdate(
            id,
            {
                name,
                email,
                password: hashedPassword,
                Core,
                role
            },
            { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators: true` validates the update
        );

        res.status(200).json({ message: "User updated successfully", user: updatedUser });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
};


export { getAllUser, createUser, viewUser, viewProfile, deleteUser, updateUser };