import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: ["Approved", "Pending", "Rejected"], default: "Pending" },
    description: { type: String },
    attachmentName: { type: String },
});

const Document = mongoose.model("Document", documentSchema);

export default Document;