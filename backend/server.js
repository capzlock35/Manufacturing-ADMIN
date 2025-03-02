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
import financialReportRoutes from './routes/financialReportRoutes.js'; 
import hr3DocumentRoute from './routes/hr3DocumentRoute.js';
import dotenv from "dotenv";

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

app.use('/api/financial-reports', financialReportRoutes);


app.use('/hr3/get-documents', hr3DocumentRoute);



app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});