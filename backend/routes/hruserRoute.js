import express from 'express';
import {createUser, getAllUser, deleteUser} from '../controller/hrController.js'

const  hruserRouter = express.Router();

hruserRouter.get("/get",getAllUser);
hruserRouter.post("/create",createUser);
hruserRouter.delete('/delete/:id', deleteUser);

export default hruserRouter;

