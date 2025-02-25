// backend/routes/qcDataRoute.js
import express from "express";
import { submitQCData, getQCMetrics, deleteQCData } from "../controller/qcDataController.js"; // Import deleteQCData

const router = express.Router();

router.post("/data", submitQCData);
router.get("/metrics", getQCMetrics);
router.delete("/data/:batchId", deleteQCData); // <-- ADD DELETE ROUTE HERE

export default router;