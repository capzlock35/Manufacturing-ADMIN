import express from 'express';
import {getAllUser,createUser,Login,updateUser,deleteUser, viewUser, viewProfile} from '../controller/userController.js'
import authMiddleware from '../middleware/authMiddleware.js';
import verifyToken from "../middleware/verifyToken.js"

const  userRouter = express.Router();

userRouter.get("/get", getAllUser);
userRouter.post("/create",createUser);
userRouter.post("/", createUser);
userRouter.post('/login', Login);
userRouter.get("/view/:id", viewUser)
userRouter.put("/update/:id", updateUser);
userRouter.delete("/delete/user/:id", deleteUser);
//GET Registered users
userRouter.get("/profile", authMiddleware, viewProfile);
userRouter.put("/profile/update", authMiddleware, updateUser);


//userRouter.put("/update/:id",updateUser);
//userRouter.delete("/delete/:id",deleteUser);





export default userRouter;
 