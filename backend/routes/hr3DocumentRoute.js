import express from 'express';
import { getHr3document } from '../controller/hr3DocumentController.js';
import verifyGate from '../middleware/verifyGate.js';

const hr3DocumentRoute = express.Router();

hr3DocumentRoute.get("/get", verifyGate, getHr3document);

export default hr3DocumentRoute;