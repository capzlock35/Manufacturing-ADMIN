import Logistic from '../model/logisticModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'LOGISTICADMIN';

// Get all users
const getAllUser = async (req, res) => {
    try {
        const users = await Logistic.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ message: "Failed to retrieve users" });
    }
};

// Create User
const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, userName, phone, date, address, city, role, age, condition, verified } = req.body;

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
            verified
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
        const user = await Logistic.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create token
        const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful", token: token, role: user.role });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Login failed" });
    }
};

export { getAllUser, createUser, Login };