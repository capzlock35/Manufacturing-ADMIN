import express from 'express';
import {getAllUser,createUser,Login} from '../controller/userController.js'

const  userRouter = express.Router();

userRouter.get("/get",getAllUser);
userRouter.post("/create",createUser);
userRouter.post('/login', Login);

//GET Registered users

//userRouter.put("/update/:id",updateUser);
//userRouter.delete("/delete/:id",deleteUser);


export default userRouter;
 