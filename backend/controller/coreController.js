import CoreUser from "../model/coreModel.js";
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'BOSSING'

const createUser = async (req, res) => {
    try {
      const { 
        name,
        email,  
        password 
      } = req.body;
  
      // Check if user already exists
      const emailExists = await CoreUser.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      const usernameExists = await CoreUser.findOne({ name });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const user = await CoreUser.create({
        name,
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
        const user = await CoreUser.findOne({ email });

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

//Get All User
const getAllUser = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Default to page 1
      const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
      const department = req.query.department; // Get the department from query if available
  
      // Build the query object
      let query = {};
      if (department) {
        query.department = department; // Only fetch users from the specified department
      }
  
      // Get the users with pagination and filtering by department
      const users = await CoreUser.find(query)
        .skip((page - 1) * limit)  // Skip users from previous pages
        .limit(limit); // Limit the number of users per page
  
      // Get total count of users for pagination info
      const totalUsers = await CoreUser.countDocuments(query);
  
      // Respond with paginated data
      res.status(200).json({
        users,
        totalPages: Math.ceil(totalUsers / limit),  // Calculate total pages
        currentPage: page,
      });
    } catch (error) {
      res.status(500).json({ error: 'Unable to get users' });
    }
  };

  const viewUser = async(req,res) => {
    try{
        const userId = req.params.id;
        const user = await CoreUser.findById(userId);
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
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve profile' });
    }
};



export {createUser,Login,getAllUser,viewUser,viewProfile};