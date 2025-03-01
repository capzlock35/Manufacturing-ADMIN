import express from 'express';
import { getHr3document } from '../controller/hr3DocumentController.js';
import verifyToken from "../middleware/verifyToken.js";

const hr3DocumentRoute = express.Router();

hr3DocumentRoute.get("/get", verifyToken, getHr3document);

export default hr3DocumentRoute;