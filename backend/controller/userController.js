import User from '../model/userModel.js';

const getAllUser = async(req,res) => {
    const gettingUser = await User.find();


    if(!gettingUser){
        return res.status(400).json({success:false, message:"Not Found!"});
    }

    res.status(200).json(gettingUser);
} 


    const createUser = async(req,res) => {
        const {email, username, password} = req.body;

        const newAccount = new User({
            email,
            username,
            password 
        })


        await newAccount.save();

        res.status(201).json("Created Successfully")
    }


export {getAllUser,createUser};