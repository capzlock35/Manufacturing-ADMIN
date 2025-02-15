import express from 'express';
import {createUser, Login, getAllUser, deleteUser, updateUser} from '../controller/logisticController.js'

const  logisticuserRouter = express.Router();

logisticuserRouter.get("/get",getAllUser);
logisticuserRouter.post("/create",createUser);
logisticuserRouter.post("/", createUser);
logisticuserRouter.post('/login', Login);
logisticuserRouter.delete('/:id', deleteUser);
logisticuserRouter.put('/:id',updateUser );

export default logisticuserRouter;