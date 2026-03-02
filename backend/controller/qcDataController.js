// backend/controller/qcDataController.js
import QCData from "../model/qcDataModel.js";

// --- Define Limits (Keep existing limits) ---
const PH_GOOD_UPPER = 10.5;
const PH_GOOD_LOWER = 9.0;
const PH_ACCEPTABLE_UPPER = 11.0;
const PH_ACCEPTABLE_LOWER = 8.5;

const MOISTURE_GOOD_UPPER = 20;
const MOISTURE_GOOD_LOWER = 8;
const MOISTURE_ACCEPTABLE_UPPER = 25;
const MOISTURE_ACCEPTABLE_LOWER = 5;

const FRAGRANCE_GOOD_UPPER = 10;
const FRAGRANCE_GOOD_LOWER = 7;
const FRAGRANCE_ACCEPTABLE_UPPER = 6;
const FRAGRANCE_ACCEPTABLE_LOWER = 5;

const COLOR_GOOD_UPPER = 10;
const COLOR_GOOD_LOWER = 7;
const COLOR_ACCEPTABLE_UPPER = 6;
const COLOR_ACCEPTABLE_LOWER = 5;

const CONCENTRATION_GOOD_UPPER = 30;
const CONCENTRATION_GOOD_LOWER = 15;
const CONCENTRATION_ACCEPTABLE_UPPER = 35;
const CONCENTRATION_ACCEPTABLE_LOWER = 10;


export const submitQCData = async (req, res) => {
    try {
        const {
            batchId,
            pHLevel,
            moisture,
            fragranceRating,
            colorRating,
            concentration,
            ingredients, // Added
            expirationDate // Added
        } = req.body;

        // --- Data Validation (Includes new fields) ---
        if (!batchId || pHLevel === undefined || moisture === undefined || fragranceRating === undefined || colorRating === undefined || concentration === undefined || !expirationDate) { // Added expirationDate check
            return res.status(400).json({ message: "Batch ID, QC parameters, and Expiration Date are required." });
        }
        if (typeof pHLevel !== 'number') return res.status(400).json({ message: "pH Level must be a number." });
        if (typeof moisture !== 'number') return res.status(400).json({ message: "Moisture % must be a number." });
        if (typeof fragranceRating !== 'number') return res.status(400).json({ message: "Fragrance Rating must be a number." });
        if (typeof colorRating !== 'number') return res.status(400).json({ message: "Color Rating must be a number." });
        if (typeof concentration !== 'number') return res.status(400).json({ message: "Concentration must be a number." });
        // Basic check for ingredients if provided
        if (ingredients && typeof ingredients !== 'string') {
             return res.status(400).json({ message: "Ingredients must be a string." });
        }
        // Basic check if expirationDate can be parsed (Mongoose will also validate Date type)
        if (isNaN(Date.parse(expirationDate))) {
            return res.status(400).json({ message: "Invalid Expiration Date format." });
        }


        // --- Determine Status (Bad, Acceptable, Good) - NO CHANGES needed here ---
        let status = "Bad"; // Default to Bad (Fail)

        const isGoodPH = pHLevel >= PH_GOOD_LOWER && pHLevel <= PH_GOOD_UPPER;
        const isGoodMoisture = moisture >= MOISTURE_GOOD_LOWER && moisture <= MOISTURE_GOOD_UPPER;
        const isGoodFragrance = fragranceRating >= FRAGRANCE_GOOD_LOWER && fragranceRating <= FRAGRANCE_GOOD_UPPER;
        const isGoodColor = colorRating >= COLOR_GOOD_LOWER && colorRating <= COLOR_GOOD_UPPER;
        const isGoodConcentration = concentration >= CONCENTRATION_GOOD_LOWER && concentration <= CONCENTRATION_GOOD_UPPER;

        // Check for Bad first - ANY parameter outside acceptable range makes it Bad
        const isBadPH = pHLevel < PH_ACCEPTABLE_LOWER || pHLevel > PH_ACCEPTABLE_UPPER;
        const isBadMoisture = moisture < MOISTURE_ACCEPTABLE_LOWER || moisture > MOISTURE_ACCEPTABLE_UPPER;
        const isBadFragrance = fragranceRating < FRAGRANCE_ACCEPTABLE_LOWER; // Only lower bound for Bad
        const isBadColor = colorRating < COLOR_ACCEPTABLE_LOWER; // Only lower bound for Bad
        const isBadConcentration = concentration < CONCENTRATION_ACCEPTABLE_LOWER || concentration > CONCENTRATION_ACCEPTABLE_UPPER;

        if (isBadPH || isBadMoisture || isBadFragrance || isBadColor || isBadConcentration) {
            status = "Bad";
        }
        // If not Bad, check if ALL parameters are Good
        else if (isGoodPH && isGoodMoisture && isGoodFragrance && isGoodColor && isGoodConcentration) {
            status = "Good";
        }
        // If not Bad and not all Good, it must be Acceptable (at least one parameter is in the acceptable range but not good)
        else {
             status = "Acceptable"; // All other cases that aren't Bad or Good fall here
        }


        // --- Create and Save QC Data (Includes new fields) ---
        const newQCData = new QCData({
            batchId,
            pHLevel,
            moisture,
            fragranceRating,
            colorRating,
            concentration,
            ingredients, // Added
            expirationDate, // Added
            status,
            // timestamp will be set by default
        });

        const savedQCData = await newQCData.save();

        res.status(201).json({
            message: "QC Data submitted successfully.",
            qcData: savedQCData,
        });
    } catch (error) {
        console.error("Error submitting QC Data:", error);
        if (error.code === 11000) { // Duplicate batchId
            return res.status(409).json({ message: "Batch ID already exists. Please use a unique Batch ID." });
        }
        if (error.name === 'ValidationError') { // Mongoose validation error
            return res.status(400).json({ message: "Validation Error: " + error.message });
        }
        res.status(500).json({
            message: "Failed to submit QC Data.",
            error: error.message,
        });
    }
};

export const getQCMetrics = async (req, res) => {
    try {
        // Fetch all data, including the new fields
        const allQCData = await QCData.find().sort({ timestamp: -1 }); // Sort by submission time

        // --- Basic Metrics Calculation (No change needed here) ---
        const totalBatches = allQCData.length;
        const goodBatches = allQCData.filter((data) => data.status === "Good").length;
        const acceptableBatches = allQCData.filter((data) => data.status === "Acceptable").length;
        const badBatches = allQCData.filter((data) => data.status === "Bad").length;


        const metrics = {
            totalBatches,
            goodBatches,
            acceptableBatches,
            badBatches,
            goodBatchPercentage: totalBatches > 0 ? (goodBatches / totalBatches) * 100 : 0,
            acceptableBatchPercentage: totalBatches > 0 ? (acceptableBatches / totalBatches) * 100 : 0,
            badBatchPercentage: totalBatches > 0 ? (badBatches / totalBatches) * 100 : 0,
            qcDataList: allQCData, // Contains all fields including new ones
        };

        res.status(200).json({ metrics });
    } catch (error) {
        console.error("Error fetching QC Metrics:", error);
        res.status(500).json({
            message: "Failed to fetch QC Metrics.",
            error: error.message,
        });
    }
};


export const deleteQCData = async (req, res) => {
    try {
        const { batchId } = req.params;

        if (!batchId) {
            return res.status(400).json({ message: "Batch ID is required for deletion." });
        }

        const deletedQCData = await QCData.findOneAndDelete({ batchId });

        if (!deletedQCData) {
            return res.status(404).json({ message: "QC Data not found for Batch ID: " + batchId });
        }

        res.status(200).json({ message: "QC Data deleted successfully.", deletedQCData });

    } catch (error) {
        console.error("Error deleting QC Data:", error);
        res.status(500).json({
            message: "Failed to delete QC Data.",
            error: error.message,
        });
    }
};