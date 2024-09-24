import express from 'express';
import {getAllUser,createUser} from '../controller/userController.js'

const  userRouter = express.Router();

userRouter.get("/",getAllUser);
userRouter.post("/create",createUser);
userRouter.post('/login', async (req, res) => {
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

//GET Registered users
userRouter.get('/register', async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).json(users)
    } catch (error) {
        res.status(500).json({ error: 'Unable to get users' })
    }
} )
//userRouter.put("/update/:id",updateUser);
//userRouter.delete("/delete/:id",deleteUser);


export default userRouter;
 