import express from 'express';
import {createUser, getAllUser, viewUser, viewProfile, deleteUser,deactivateUser, reactivateUser, getActiveUsers, getInactiveUsers, updateUser} from '../controller/coreController.js'
import authMiddleware from '../middleware/authMiddleware.js';
import verifyToken from "../middleware/verifyToken.js"

const  coreuserRouter = express.Router();

coreuserRouter.get("/get",verifyToken, getAllUser);
coreuserRouter.get("/getActiveUsers", verifyToken, getActiveUsers); // <-- Moved UP
coreuserRouter.get("/getInactiveUsers", verifyToken, getInactiveUsers); // <-- Moved UP
coreuserRouter.post("/create",createUser);
coreuserRouter.get("/:id", viewUser)
coreuserRouter.get("/profile", authMiddleware, viewProfile);
coreuserRouter.delete('/:id', deleteUser);
coreuserRouter.put("/update/:id", updateUser);
coreuserRouter.patch("/reactivateUser/:id", reactivateUser)
coreuserRouter.patch("/deactivateUser/:id", deactivateUser)

export default coreuserRouter;