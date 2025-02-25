// backend/controller/qcDataController.js
import QCData from "../model/qcDataModel.js";

// --- Define Limits based on provided table ---
const PH_GOOD_UPPER = 10.5;
const PH_GOOD_LOWER = 9.0;
const PH_ACCEPTABLE_UPPER = 11.0;
const PH_ACCEPTABLE_LOWER = 8.5;

const MOISTURE_GOOD_UPPER = 20; // Assuming solid product based on range
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
        const { batchId, pHLevel, moisture, fragranceRating, colorRating, concentration } = req.body;

        // --- Data Validation (same as before) ---
        if (!batchId || pHLevel === undefined || moisture === undefined || fragranceRating === undefined || colorRating === undefined || concentration === undefined) {
            return res.status(400).json({ message: "All QC parameters are required." });
        }
        if (typeof pHLevel !== 'number') return res.status(400).json({ message: "pH Level must be a number." });
        if (typeof moisture !== 'number') return res.status(400).json({ message: "Moisture % must be a number." });
        if (typeof fragranceRating !== 'number') return res.status(400).json({ message: "Fragrance Rating must be a number." });
        if (typeof colorRating !== 'number') return res.status(400).json({ message: "Color Rating must be a number." });
        if (typeof concentration !== 'number') return res.status(400).json({ message: "Concentration must be a number." });


        // --- Determine Status (Bad, Acceptable, Good) - EXPLICIT LOGIC ---
        let status = "Bad"; // Default to Bad (Fail)

        const isGoodPH = pHLevel >= PH_GOOD_LOWER && pHLevel <= PH_GOOD_UPPER;
        const isGoodMoisture = moisture >= MOISTURE_GOOD_LOWER && moisture <= MOISTURE_GOOD_UPPER;
        const isGoodFragrance = fragranceRating >= FRAGRANCE_GOOD_LOWER && fragranceRating <= FRAGRANCE_GOOD_UPPER;
        const isGoodColor = colorRating >= COLOR_GOOD_LOWER && colorRating <= COLOR_GOOD_UPPER;
        const isGoodConcentration = concentration >= CONCENTRATION_GOOD_LOWER && concentration <= CONCENTRATION_GOOD_UPPER;

        const isAcceptablePH = (pHLevel >= PH_ACCEPTABLE_LOWER && pHLevel < PH_GOOD_LOWER) || (pHLevel > PH_GOOD_UPPER && pHLevel <= PH_ACCEPTABLE_UPPER);
        const isAcceptableMoisture = (moisture >= MOISTURE_ACCEPTABLE_LOWER && moisture < MOISTURE_GOOD_LOWER) || (moisture > MOISTURE_GOOD_UPPER && moisture <= MOISTURE_ACCEPTABLE_UPPER);
        const isAcceptableFragrance = (fragranceRating >= FRAGRANCE_ACCEPTABLE_LOWER && fragranceRating <= FRAGRANCE_ACCEPTABLE_UPPER);
        const isAcceptableColor = (colorRating >= COLOR_ACCEPTABLE_LOWER && colorRating <= COLOR_ACCEPTABLE_UPPER);
        const isAcceptableConcentration = (concentration >= CONCENTRATION_ACCEPTABLE_LOWER && concentration <= CONCENTRATION_ACCEPTABLE_UPPER);

        const isBadPH = pHLevel < PH_ACCEPTABLE_LOWER || pHLevel > PH_ACCEPTABLE_UPPER; // Explicit Bad conditions
        const isBadMoisture = moisture < MOISTURE_ACCEPTABLE_LOWER || moisture > MOISTURE_ACCEPTABLE_UPPER;
        const isBadFragrance = fragranceRating < FRAGRANCE_ACCEPTABLE_LOWER;
        const isBadColor = colorRating < COLOR_ACCEPTABLE_LOWER;
        const isBadConcentration = concentration < CONCENTRATION_ACCEPTABLE_LOWER || concentration > CONCENTRATION_ACCEPTABLE_UPPER;


        // --- Status Determination - EXPLICIT BAD, then GOOD, then ACCEPTABLE ---
        if (isBadPH || isBadMoisture || isBadFragrance || isBadColor || isBadConcentration) {
            status = "Bad"; // Fail - Check for Bad status FIRST and explicitly
        }
        else if (isGoodPH && isGoodMoisture && isGoodFragrance && isGoodColor && isGoodConcentration) {
            status = "Good"; // Pass - Then check for Good status explicitly
        }
        else if (isAcceptablePH || isAcceptableMoisture || isAcceptableFragrance || isAcceptableColor || isAcceptableConcentration) {
            status = "Acceptable"; // Borderline - Then check for Acceptable explicitly
        }
        // else status remains "Bad" (default) - No need for explicit else, as default is already "Bad"


        // --- Create and Save QC Data (same as before) ---
        const newQCData = new QCData({
            batchId,
            pHLevel,
            moisture,
            fragranceRating,
            colorRating,
            concentration,
            status,
        });

        const savedQCData = await newQCData.save();

        res.status(201).json({
            message: "QC Data submitted successfully.",
            qcData: savedQCData,
        });
    } catch (error) {
        console.error("Error submitting QC Data:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Batch ID already exists. Please use a unique Batch ID." });
        }
        res.status(500).json({
            message: "Failed to submit QC Data.",
            error: error.message,
        });
    }
};

export const getQCMetrics = async (req, res) => {
    try {
        const allQCData = await QCData.find().sort({ timestamp: -1 });

        // --- Basic Metrics Calculation (Updated for Good, Acceptable, Bad) ---
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
            qcDataList: allQCData,
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

// ... (rest of your controller code - limits, submitQCData, getQCMetrics) ...

export const deleteQCData = async (req, res) => {
    try {
        const { batchId } = req.params; // Extract batchId from URL parameters

        if (!batchId) {
            return res.status(400).json({ message: "Batch ID is required for deletion." });
        }

        const deletedQCData = await QCData.findOneAndDelete({ batchId }); // Find and delete by batchId

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