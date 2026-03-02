// backend/model/qcDataModel.js
import mongoose from "mongoose";

const qcDataSchema = new mongoose.Schema(
    {
        batchId: {
            type: String,
            required: true,
            unique: true,
        },
        timestamp: { // Timestamp of QC data submission
            type: Date,
            default: Date.now,
        },
        pHLevel: {
            type: Number,
            required: true,
        },
        moisture: {
            type: Number,
            required: true,
        },
        fragranceRating: {
            type: Number,
            required: true,
        },
        colorRating: {
            type: Number,
            required: true,
        },
        concentration: {
            type: Number,
            required: true,
        },
        ingredients: { // Added ingredients field
            type: String,
            required: false, // Make optional or true as needed
            default: '',
        },
        expirationDate: { // Added expiration date field
            type: Date,
            required: true, // Usually required for products
        },
        status: {
            type: String,
            enum: ["Good", "Acceptable", "Bad"],
            required: true,
        },
        testResults: {
            type: Object,
            default: {},
        },
    },
    { timestamps: true } // Adds createdAt and updatedAt timestamps managed by Mongoose
);

const QCData = mongoose.model("QCData", qcDataSchema);

export default QCData;