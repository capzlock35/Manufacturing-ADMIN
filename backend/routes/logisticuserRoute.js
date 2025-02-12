import express from 'express';
import {createUser, Login, getAllUser} from '../controller/logisticController.js'

const  logisticuserRouter = express.Router();

logisticuserRouter.get("/get",getAllUser);
logisticuserRouter.post("/create",createUser);
logisticuserRouter.post("/", createUser);
logisticuserRouter.post('/login', Login);

export default logisticuserRouter;