import express from 'express';
import { createUser, getAllUser, deleteUser, updateUser } from '../controller/hrController.js';
import verifyToken from "../middleware/verifyToken.js";

const hruserRouter = express.Router();

hruserRouter.get("/get", verifyToken, getAllUser);
hruserRouter.post("/create",  createUser);  // Protect create
hruserRouter.put('/:id', verifyToken, updateUser);  // Corrected route and added verifyToken
hruserRouter.delete('/:id', deleteUser);
export default hruserRouter;