import express from 'express';
import {createUser, Login, getAllUser, deleteUser} from '../controller/hrController.js'

const  hruserRouter = express.Router();

hruserRouter.get("/get",getAllUser);
hruserRouter.post("/create",createUser);
hruserRouter.post('/login', Login);
hruserRouter.delete('/delete/:id', deleteUser);

export default hruserRouter;

