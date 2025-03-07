import express from 'express';
import { ConnectDB } from './config/db.js';
import "dotenv/config";
import cors from "cors";
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRoute.js';
import documentRouter from './routes/documentRoute.js'; // Import the documentRouter
import resourceRoute from './routes/resourceRoute.js'; // Import the resource route
import requestresourceRoute from './routes/requestresourcesRoute.js';
import coreuserRouter from './routes/coreuserRouter.js';
import financeuserRouter from './routes/financeuserRoute.js';
import hruserRouter from './routes/hruserRoute.js';
import logisticuserRouter from './routes/logisticuserRoute.js';
import uploadRoute from "./routes/uploadRoute.js";
import authRoutes from './routes/auth.js';
import productRouter from './routes/productRoute.js';
import admninuserRouter from './routes/adminuserRoute.js';
import announcementRouter from './routes/announcementRoutes.js';
import qcDataRoute from './routes/qcDataRoute.js';
import vsRoute from './routes/vsRoute.js' 
import dotenv from "dotenv";
import contractRoutes from './routes/contractRoutes.js'; 
import riskAssessmentRoutes from './routes/riskAssessmentRoutes.js';
import axios from 'axios';

dotenv.config();


const app = express();
const port = process.env.PORT || 7690;
const allowedOrigins = [
    'http://localhost:5173',         // Allow localhost for development
    'https://admin.jjm-manufacturing.com' // Allow production domain
];


// Setup CORS dynamically
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use('/api/auth', authRoutes);

app.use(express.json({ limit: '50mb' }));  // Middleware to parse JSON

app.use(fileUpload());

ConnectDB();  // Establish DB connection

// Routes
app.get("/", (req, res) => {
    res.send("Hello world");
});


// Use the user routes
app.use("/api/user", userRouter); // Admin

app.use("/api/coreusers", coreuserRouter); // Core

app.use("/api/finance", financeuserRouter); // Finance

app.use("/api/hrusers", hruserRouter);  // HR

app.use("/api/logisticusers", logisticuserRouter); // Logistic

app.use("/api/adminusers", admninuserRouter);


// ----------------------------------------------------------------------------------------

app.use("/api/announcements", announcementRouter );

app.use('/api/product', productRouter);

app.use("/api/resources", resourceRoute); // Resources

app.use("/api/requestresources", requestresourceRoute); // RequestR.

app.use("/api/documents", documentRouter); // DocumentStorage

app.use("/api/upload", uploadRoute);

app.use("/api/qc", qcDataRoute);

app.use('/api/vs', vsRoute)



app.use('/api/contracts', contractRoutes);


app.use('/api/risk-assessments', riskAssessmentRoutes);

const API_BASE_URL_FINANCE = 'https://gateway.jjm-manufacturing.com/finance'; // API Gateway URL for finance (KEEP THIS AS SERVER-SIDE CONSTANT)
const authURL_FINANCE = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/auth/get-tokenG' // Production token endpoint (KEEP THIS AS SERVER-SIDE CONSTANT)
    : 'http://localhost:7690/api/auth/get-tokenG'; // Local token endpoint (KEEP THIS AS SERVER-SIDE CONSTANT)


app.get('/api/finance-reports', async (req, res) => {
    try {
        // 1. Get a token from your auth service (Backend now handles token retrieval)
        const tokenResponse = await axios.get(authURL_FINANCE); // Use the backend's authURL
        const token = tokenResponse.data.token;

        if (!token) {
            console.error("Backend: No token received from auth service!");
            return res.status(401).json({ error: "Failed to authenticate with token service." }); // Or appropriate error code
        }

        // 2. Make the request to the API Gateway to get financial reports (from backend)
        const reportsResponse = await axios.get(`${API_BASE_URL_FINANCE}/get-financial-reports`, { // Use the backend's API_BASE_URL_FINANCE
            headers: {
                Authorization: `Bearer ${token}`, // Use the token obtained by the backend
            },
        });

        // 3. Send the data back to the frontend
        res.json(reportsResponse.data); // Send the reports data to the frontend
    } catch (error) {
        console.error("Backend error fetching reports:", error);
        if (error.response) {
            res.status(error.response.status).json({
                error: "Failed to fetch financial reports from API Gateway.",
                details: error.response.data
            });
        } else if (error.request) {
            res.status(500).json({ error: "Failed to fetch financial reports. No response from API Gateway." });
        }
        else {
            res.status(500).json({ error: "Failed to fetch financial reports. An unexpected error occurred on the server." });
        }
    }
});


const API_BASE_URL_HR3 = 'https://gateway.jjm-manufacturing.com/hr3'; // API Gateway URL for HR3 (SERVER-SIDE CONSTANT)
const authURL_HR3 = process.env.NODE_ENV === 'production'
    ? 'https://backend-admin.jjm-manufacturing.com/api/auth/get-tokenG' // Production token endpoint (SERVER-SIDE CONSTANT)
    : 'http://localhost:7690/api/auth/get-tokenG'; // Local token endpoint (SERVER-SIDE CONSTANT)


    app.get('/api/hr3-documents', async (req, res) => {
    try {
        // 1. Get a token (Backend handles token retrieval)
        const tokenResponse = await axios.get(authURL_HR3); // Use backend's authURL_HR3
        const token = tokenResponse.data.token;

        if (!token) {
            console.error("Backend: No token received from auth service for HR3!");
            return res.status(401).json({ error: "Failed to authenticate with token service for HR3." });
        }

        // 2. Make request to HR3 API Gateway (from backend)
        const documentsResponse = await axios.get(`${API_BASE_URL_HR3}/get-documents`, { // Use backend's API_BASE_URL_HR3
            headers: {
                Authorization: `Bearer ${token}`, // Use the token obtained by backend
            },
        });

        // 3. Send HR3 documents data back to frontend
        res.json(documentsResponse.data); // Send the documents data
    } catch (error) {
        console.error("Backend error fetching HR3 documents:", error);
        if (error.response) {
            res.status(error.response.status).json({
                error: "Failed to fetch HR3 documents from API Gateway.",
                details: error.response.data
            });
        } else if (error.request) {
            res.status(500).json({ error: "Failed to fetch HR3 documents. No response from API Gateway." });
        }
        else {
            res.status(500).json({ error: "Failed to fetch HR3 documents. An unexpected server error occurred." });
        }
    }
});


app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});