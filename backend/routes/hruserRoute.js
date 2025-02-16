import express from 'express';
import {createUser, getAllUser, deleteUser} from '../controller/hrController.js'
import verifyToken from "../middleware/verifyToken.js"


const  hruserRouter = express.Router();

hruserRouter.get("/get",verifyToken, getAllUser);
hruserRouter.post("/create",createUser);
hruserRouter.delete('/delete/:id', deleteUser);

export default hruserRouter;

