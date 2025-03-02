// routes/financialReportRoutes.js (Updated to ES Modules)
import express from 'express'; // Changed from require
import * as financialReportController from '../controller/financialReportController.js'; // Changed from require and updated extension
import verifyToken from "../middleware/verifyToken.js"
const router = express.Router();

router.post('/', financialReportController.createFinancialReport); // POST to create a new report
router.get('/', verifyToken,financialReportController.getAllFinancialReports); // GET to get all reports

export default router; // Changed from module.exports