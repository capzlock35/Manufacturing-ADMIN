import mongoose from "mongoose";

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must at least has a 6 character long"]
    },
    Core: {
        type: Number,
        enum: [1, 2],
        required: true,
        default: 1,
    },
    role: {
        type: String,
        enum: ["admin", "auditor", "audit","maintenancemanager", "superadmin"],
        default: "audit",
    },
    // --- ADDED STATUS FIELD ---
    status: {
        type: String,
        enum: ["active", "inactive"], // Allowed values
        default: "active",            // Default value
    },
    // --- END OF ADDED STATUS FIELD ---
}, { timestamps: true }); // Added timestamps for better tracking (optional but good practice)

const CoreUser = mongoose.model('CoreUser', userSchema);

export default CoreUser;