import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';
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

const viewUser = async(req,res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user){
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' })
    }
}

const updateUser = async(req,res) => {
    try{
        const userId = req.params.id;
        const { firstname, lastname, birthday, gender, email, username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.findByIdAndUpdate( userId, {firstname, lastname, birthday, gender, email, username, password:hashedPassword}, { new: true} );
        res.status(201).json({ message: 'User Updated successfully' })
        if (!updateUser){
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        } catch (error) {
            res.status(500).json({ error: 'Failed to Update' })
        }
    }

const deleteUser = async (req, res) =>{
    try{
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);
        res.status(201).json({ message: 'User was Deleted successfully' })
        if (!user){
            return res.status(401).json({ error: 'Invalid credentials' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error to delete' })
    }
}


const createUser = async(req,res) => {
    try{
        const { firstname, lastname, birthday, gender, email, username, password } = req.body
        // hash the password before saving to database
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
            }// check if password is matches
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' })
            }// sign JWT token
            const token = jwt.sign({ userid: user._id }, SECRET_KEY, { expiresIn: '1hr' })
            res.json({ message: 'Login successful',token})
        } catch (error) {
            res.status(500).json({ error: 'Error logging in' })
        }
    }


export {getAllUser,updateUser,viewUser,deleteUser,createUser,Login};