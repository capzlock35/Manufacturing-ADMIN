import express from 'express';
import {createUser, Login, getAllUser, viewUser, viewProfile, deleteUser} from '../controller/coreController.js'
import authMiddleware from '../middleware/authMiddleware.js';

const  coreuserRouter = express.Router();

coreuserRouter.get("/get",getAllUser);
coreuserRouter.post("/create",createUser);
coreuserRouter.post('/login', Login);
coreuserRouter.get("/view/:id", viewUser)
coreuserRouter.get("/profile", authMiddleware, viewProfile);
coreuserRouter.delete('/delete/:id', deleteUser);

export default coreuserRouter;