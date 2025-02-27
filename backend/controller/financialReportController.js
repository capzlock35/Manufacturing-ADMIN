// controllers/financialReportController.js (Updated to ES Modules)
import FinancialReport from '../model/FinancialReport.js'; // Changed from require and updated extension

const createFinancialReport = async (req, res) => {
  try {
    const newReport = new FinancialReport(req.body); // Create a new FinancialReport document
    const savedReport = await newReport.save(); // Save to MongoDB
    res.status(201).json(savedReport); // Respond with 201 Created and the saved report
  } catch (error) {
    res.status(500).json({ error: 'Failed to create financial report', details: error.message });
  }
};

const getAllFinancialReports = async (req, res) => {
  try {
    const reports = await FinancialReport.find().sort({ createdAt: -1 }); // Fetch all reports, sort by creation date (newest first)
    res.status(200).json(reports); // Respond with 200 OK and the array of reports
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch financial reports', details: error.message });
  }
};

export { // Changed from module.exports
  createFinancialReport,
  getAllFinancialReports,
};