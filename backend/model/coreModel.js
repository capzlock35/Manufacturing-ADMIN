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
        enum: ["admin", "auditor", "audit","maintenancemanager"], // ADDED "audit" and "admin" and remove rest
        default: "audit",
    },
});

const CoreUser = mongoose.model('CoreUser', userSchema);

export default CoreUser;