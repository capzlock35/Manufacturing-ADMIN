const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/userSchema')
const Product = require('./models/productSchema')
const Order = require('./models/orderSchema')

const SECRET_KEY = 'secretkey'

//express connction
const app = express()

const port = 8000;


//MongoDB connection
const dbURI = 'mongodb+srv://olandakent10:test112@cluster10.bixwa.mongodb.net/UsersDB?retryWrites=true&w=majority&appName=Cluster10'
mongoose
.connect(dbURI, { 
})
.then(() =>{
    app.listen(port, () => {
        console.log('Server is Connected to port 8000 and connected to MongoDb')
    })
})
.catch((error) => {
    console.log('Unable to connect to Server and/or MongoDB')
})
//middleware
app.use(bodyParser.json())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
})
) 
//



//Routes
//USER REGISTRATION
//POST REGISTER
app.post('/register', async (req, res) => {
    try{
        const { email, username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ email, username, password:hashedPassword })
        await newUser.save()
        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Error signing up' })
    }
})


//GET Registered users
app.get('/register', async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).json(users)
    } catch (error) {
        res.status(500).json({ error: 'Unable to get users' })
    }
} )

//Get Login
app.post('/login', async (req, res) => {
    try{
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user){
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        const token = jwt.sign({ userId: user._Id }, SECRET_KEY, { expiresIn: '1hr' })
        res.json({ message: 'Login successful' })
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' })
    }
})
// Products
app.post('/', async (req, res) => {
    const { name, price, quantity } = req.body;
    try {
      const product = new Product({ name, price, quantity });
      await product.save();
      res.status(201).send('Product created');
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  
  app.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(400).send(error.message);
    }
  })

  app.post('/', async (req, res) => {
    const { productId, quantity } = req.body;
    try {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).send('Product not found');
      const order = new Order({ product: productId, quantity });
      await order.save();
      res.status(201).send('Order created');
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  
  app.get('/', async (req, res) => {
    try {
      const orders = await Order.find().populate('product');
      res.json(orders);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

// Create // POST REQUEST
// Read // GET REQUEST
// Update // PUT or PATCH REQUEST
// Delete // DELETE REQUEST