import Hruser from "../model/hrModel.js";
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'HRADMIN'

const createUser = async (req, res) => {
    try {
      const { 
        firstname,
        lastname,
        email,  
        password 
      } = req.body;
  
      // Check if user already exists
      const emailExists = await Hruser.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      const usernameExists = await Hruser.findOne({ name });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const user = await Hruser.create({
        firstname,
        lastname,
        email,
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
        const user = await Hruser
        .findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if the role is either 'admin' or 'staff'
        if (user.role !== 'admin' && user.role !== 'staff') {
            return res.status(403).json({ error: 'Unauthorized role' }); // 403 Forbidden for unauthorized roles
        }

        // Sign JWT token, include user ID and role in the payload
        const token = jwt.sign(
            { userid: user._id, role: user.role },  // Include role in the token payload
            SECRET_KEY, 
            { expiresIn: '1hr' }
        );

        res.json({ 
            message: 'Login successful', 
            token, 
            role: user.role // Include the role in the response
        });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

const getAllUser = async (req, res) => {
    try {
      const users = await Hruser.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export {createUser,Login,getAllUser};