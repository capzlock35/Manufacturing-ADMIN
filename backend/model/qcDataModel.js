// backend/model/qcDataModel.js
import mongoose from "mongoose";

const qcDataSchema = new mongoose.Schema(
    {
        batchId: {
            type: String,
            required: true,
            unique: true,
        },
        timestamp: {
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
        status: {
            type: String,
            enum: ["Good", "Acceptable", "Bad"], // Updated enum values to Good, Acceptable, Bad
            required: true,
        },
        testResults: {
            type: Object,
            default: {},
        },
    },
    { timestamps: true }
);

const QCData = mongoose.model("QCData", qcDataSchema);

export default QCData;