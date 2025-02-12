import Finance from '../model/financeModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'FINANCEADMIN'

// Create a new user
const createUser = async (req, res) => {
  try {
    const {
      image, 
      username,
      email,  
      fullName,
      password 
    } = req.body;

    // Check if user already exists
    const emailExists = await Finance.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const usernameExists = await Finance.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await Finance.create({
      image,
      username,
      email,
      fullName,
      password: hashedPassword
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        error: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message 
    });
  }
};

const Login = async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await Finance.findOne({ email });

      if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if password matches
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Sign JWT token, include user ID and role in the payload
      const token = jwt.sign(
          { userid: user._id },  // Include role in the token payload
          SECRET_KEY, 
          { expiresIn: '1hr' }
      );

      res.json({ 
          message: 'Login successful', 
          token
      });
  } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await Finance.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const updatedUser = await Finance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewUser = async(req,res) => {
  try{
      const userId = req.params.id;
      const user = await Finance.findById(userId);
      if (!user){
          return res.status(401).json({ error: 'Invalid credentials' })
      }
      res.status(200).json({ user });
  } catch (error) {
      res.status(500).json({ error: 'Error logging in' })
  }
}

const viewProfile = async (req, res) => {
  try {
      const userId = req.userId; // Assumes the JWT middleware sets `req.userId`
      const user = await Finance.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ user });
  } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};

export {createUser,Login,getAllUsers,updateUser,viewUser,viewProfile};