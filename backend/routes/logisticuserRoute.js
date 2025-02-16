import express from 'express';
import {createUser, getAllUser, deleteUser, updateUser} from '../controller/logisticController.js'
import verifyToken from "../middleware/verifyToken.js"


const  logisticuserRouter = express.Router();

logisticuserRouter.get("/get",verifyToken, getAllUser);
logisticuserRouter.post("/create",createUser);
logisticuserRouter.post("/", createUser);
logisticuserRouter.delete('/:id', deleteUser);
logisticuserRouter.put('/:id',updateUser );

export default logisticuserRouter;