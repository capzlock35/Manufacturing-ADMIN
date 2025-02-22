import express from 'express';
import {createUser, getAllUser, viewUser, viewProfile, deleteUser} from '../controller/coreController.js'
import authMiddleware from '../middleware/authMiddleware.js';
import verifyToken from "../middleware/verifyToken.js"

const  coreuserRouter = express.Router();

coreuserRouter.get("/get",verifyToken, getAllUser);
coreuserRouter.post("/create",createUser);
coreuserRouter.get("/:id", viewUser)
coreuserRouter.get("/profile", authMiddleware, viewProfile);
coreuserRouter.delete('/:id', deleteUser);

export default coreuserRouter;