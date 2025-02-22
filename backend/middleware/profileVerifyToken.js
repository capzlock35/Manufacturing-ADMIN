// profileVerifyToken.js

import jwt from "jsonwebtoken";
import Admin from "../model/adminModel.js"; // Assuming you have an Admin model

const profileVerifyToken = async (req, res, next) => {
  try {
    // Get the token from the header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied." });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err);
        return res.status(401).json({ message: "Token is not valid." });
      }

      // Attach the user to the request object
      req.user = await Admin.findById(decoded.userid).select("-password"); // Fetch user info without password
      next();
    });
  } catch (error) {
    console.error("Error in verifyToken middleware:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Middleware to check permissions (admin, superadmin, staff)
const profileAuthMiddleware = (req, res, next) => {
    // Check if the user has the required role (e.g., 'admin')
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin' || req.user.role === 'staff')) { // Or whatever other roles to accept
      next(); // User is authorized, proceed to the next middleware or route handler
    } else {
      return res.status(403).json({ message: 'Unauthorized: Insufficient privileges.' });
    }
  };

export  {profileVerifyToken, profileAuthMiddleware}