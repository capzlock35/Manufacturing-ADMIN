import express from 'express';
import {getAllUser,createUser,Login,updateUser,deleteUser, viewUser} from '../controller/userController.js'

const  userRouter = express.Router();

userRouter.get("/get",getAllUser);
userRouter.post("/create",createUser);
userRouter.post('/login', Login);
userRouter.get("/view/:id", viewUser)
userRouter.put("/update/:id", updateUser);
userRouter.delete("/delete/:id", deleteUser);
//GET Registered users

//userRouter.put("/update/:id",updateUser);
//userRouter.delete("/delete/:id",deleteUser);


export default userRouter;
 