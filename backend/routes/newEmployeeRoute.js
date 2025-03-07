import express from 'express'
import { getEmployees, createEmployee } from '../controller/newEmployeeController.js'

const newEmployeeRouter = express.Router();

newEmployeeRouter.get('/get', getEmployees);
newEmployeeRouter.post('/create', createEmployee);

export default newEmployeeRouter;