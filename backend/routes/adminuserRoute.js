import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import verifyToken from "../middleware/verifyToken.js"
import  {profileVerifyToken, profileAuthMiddleware} from "../middleware/profileVerifyToken.js"

import { createUser, getAllUser, updateUser, viewUser, viewProfile, Login, deleteUser } from '../controller/adminController.js';

const admninuserRouter = express.Router();

admninuserRouter.get("/get",verifyToken, getAllUser);
admninuserRouter.post("/create", createUser);
admninuserRouter.put("/update/:id", updateUser);
admninuserRouter.put("/profile/update",profileVerifyToken, profileAuthMiddleware, updateUser);
admninuserRouter.get("/view/:id",verifyToken, viewUser);
admninuserRouter.get("/profile/:id", profileVerifyToken, profileAuthMiddleware, viewProfile);
admninuserRouter.post("/login", Login);
admninuserRouter.delete("/delete/:id", deleteUser);

export default admninuserRouter;

