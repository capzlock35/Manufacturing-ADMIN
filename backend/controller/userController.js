import User from '../model/userModel.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'secret key'

const getAllUser = async(req,res) => {
    try{
        const users = await User.find()
        res.status(201).json(users)
    }
    catch (error){
        res.status(501).json({error: 'Unable to get users'})
    }const gettingUser = await User.find();

} 


    const createUser = async(req,res) => {
        try{
            const { firstname, lastname, birthday, gender, email, username, password } = req.body
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new User({ firstname, lastname, birthday, gender, email, username, password:hashedPassword })
            await newUser.save()
            res.status(201).json({ message: 'User created successfully' })
        } catch (error) {
            res.status(500).json({ error: 'Error signing up' })
        }
    }
    const Login = async (req, res) => {
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
    }


export {getAllUser,createUser,Login};