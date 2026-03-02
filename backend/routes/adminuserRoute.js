// routes/adminRoutes.js
import express from 'express';
// Assuming these are your custom middleware imports
import authMiddleware from '../middleware/authMiddleware.js';
import verifyToken from "../middleware/verifyToken.js";
import  {profileVerifyToken, profileAuthMiddleware} from "../middleware/profileVerifyToken.js";

import {
    createUser,
    getAllUser,             // Fetches active users based on controller logic
    updateUser,
    viewUser,               // Can view any user by ID
    viewProfile,
    Login,
    deleteUser,             // Permanent Delete
    getUsernameForAnnouncement,
    getLoginLogs,
    changePassword,
    removeAdminUser,       // New soft delete controller
    undoAdminUser,         // New undo controller
    fetchInactiveAdminUsers // New fetch inactive controller
} from '../controller/adminController.js';

const admninuserRouter = express.Router();

// --- Existing Routes (with existing middleware) ---
// Route to fetch all active users
admninuserRouter.get("/get", verifyToken, getAllUser); // Uses verifyToken as per your input

// --- New Routes for Status Management (No middleware added as requested) ---
// Route to fetch all inactive admin users
admninuserRouter.get('/inactive', verifyToken, fetchInactiveAdminUsers);


// Route to create a new user (No middleware as per your input)
admninuserRouter.post("/create", createUser);

// Route to update a user by ID (No middleware as per your input)
admninuserRouter.put("/update/:id", updateUser);

// Route to update the logged-in user's profile
admninuserRouter.put("/profile/update", profileVerifyToken, profileAuthMiddleware, updateUser);

// Route to view a specific user by ID
admninuserRouter.get("/view/:id", verifyToken, viewUser); // Uses verifyToken as per your input

// Route to view the logged-in user's profile
admninuserRouter.get("/profile/:id", profileVerifyToken, profileAuthMiddleware, viewProfile);

// Route for user login (No middleware as per your input)
admninuserRouter.post("/login", Login);

// Route to permanently delete a user by ID (No middleware as per your input)
admninuserRouter.delete("/delete/:id", deleteUser);

// Route to get username for announcements
admninuserRouter.get("/username/:id", profileVerifyToken, getUsernameForAnnouncement);

// Route to get login logs (No middleware as per your input)
admninuserRouter.get('/login-logs/get', getLoginLogs); // Kept the path as per your input

// Route to change user's password (No middleware as per your input)
admninuserRouter.put('/change-password', changePassword);



// Route to soft delete (set status to inactive) an admin user
admninuserRouter.patch('/remove/:id', removeAdminUser); // Using PATCH for partial update

// Route to undo soft delete (set status to active) an admin user
admninuserRouter.patch('/undo/:id', undoAdminUser);     // Using PATCH for partial update


export default admninuserRouter;