import Logistic from '../model/logisticModel.js';
import bcrypt from 'bcryptjs';


// Get all users
const getAllUser = async (req, res) => {
    try {
        const users = await Logistic.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ message: "Failed to retrieve users", error:error.message });
    }
};

// Create User
const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, userName, phone, date, address, city, role, age, condition, verified, LogisticLevel } = req.body;

        // Check if user already exists
        const existingUser = await Logistic.findOne({ email });
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
        const newUser = new Logistic({
            name,
            email,
            userName,
            password: hashedPassword,
            phone,
            date,
            address,
            city,
            role,
            age,
            condition,
            verified,
            LogisticLevel
        });

        // Save the user
        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Failed to create user",  error:error.message });
    }
};

// New backend
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by ID and delete
        const deletedUser = await Logistic.findByIdAndDelete(id);

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

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, userName, phone, date, address, city, role, age, condition, verified, LogisticLevel } = req.body;

        // Find the user by ID
        const user = await Logistic.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" ,error:error.message});
        }

        // Update the user's fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.userName = userName || user.userName;
        user.phone = phone || user.phone;
        user.date = date || user.date;
        user.address = address || user.address;
        user.city = city || user.city;
        user.role = role || user.role;
        user.age = age || user.age;
        user.condition = condition || user.condition;
        user.verified = verified || user.verified;
        user.LogisticLevel = LogisticLevel || user.LogisticLevel;

        // Save the updated user
        const updatedUser = await user.save();

        res.status(200).json({ message: "User updated successfully", user: updatedUser,error:error.message  });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
}

export { getAllUser, createUser, deleteUser,updateUser };