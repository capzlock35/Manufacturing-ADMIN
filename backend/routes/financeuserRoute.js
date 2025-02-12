import express from 'express';
import {createUser,Login,getAllUsers,updateUser,viewUser,viewProfile} from '../controller/financeController.js'
import authMiddleware from '../middleware/authMiddleware.js';

const  financeuserRouter = express.Router();

financeuserRouter.get("/get",getAllUsers);
financeuserRouter.post("/create",createUser);
financeuserRouter.post("/", createUser);
financeuserRouter.post('/login', Login);
financeuserRouter.put("/update/:id", updateUser);
financeuserRouter.get("/view/:id", viewUser)
financeuserRouter.get("/profile", authMiddleware, viewProfile);

export default financeuserRouter  ;