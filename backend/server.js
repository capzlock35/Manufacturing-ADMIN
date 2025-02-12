import express from 'express';
import { ConnectDB } from './config/db.js';
import "dotenv/config";
import cors from "cors";
import userRouter from './routes/userRoute.js';
import documentRouter from './routes/documentRoute.js'; // Import the documentRouter
import resourceRoute from './routes/resourceRoute.js'; // Import the resource route
import requestresourceRoute from './routes/requestresourcesRoute.js';
import coreuserRouter from './routes/coreuserRouter.js';
import financeuserRouter from './routes/financeuserRoute.js';
import hruserRouter from './routes/hruserRoute.js';
import logisticuserRouter from './routes/logisticuserRoute.js';



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

app.use(express.json());  // Middleware to parse JSON

ConnectDB();  // Establish DB connection

// Routes
app.get("/", (req, res) => {
    res.send("Hello world");
});

// Use the document routes
app.use("/api/documents", documentRouter); // Prefixing routes with /api/documents

// Use the user routes
app.use("/api/user", userRouter);

app.use("/api/user", coreuserRouter);

app.use("/api/user", financeuserRouter);

app.use("/api/user", hruserRouter);

app.use("/api/user", logisticuserRouter);

app.use("/api/resources", resourceRoute);

app.use("/api/requestresources", requestresourceRoute);

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
