import express from 'express';
import { createUser, getAllUsers, updateUser, viewUser, viewProfile, deleteUser } from '../controller/financeController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import verifyToken from "../middleware/verifyToken.js"


const financeuserRouter = express.Router();

// Route to get all users
financeuserRouter.get("/get",verifyToken, getAllUsers);

// Route to create a new user
financeuserRouter.post("/create", createUser);

// Route to update user by ID
financeuserRouter.put("/update/:id", updateUser);

// Route to view user by ID
financeuserRouter.get("/view/:id", viewUser);

// Route to delete user by ID
financeuserRouter.delete("/delete/:id", deleteUser);

// Route to view user profile (protected by authMiddleware)
financeuserRouter.get("/profile", authMiddleware, viewProfile);

export default financeuserRouter;