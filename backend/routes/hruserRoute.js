import express from 'express';
import {createUser, Login, getAllUser} from '../controller/hrController.js'

const  hruserRouter = express.Router();

hruserRouter.get("/get",getAllUser);
hruserRouter.post("/create",createUser);
hruserRouter.post('/login', Login);

export default hruserRouter;

