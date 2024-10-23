import express from 'express';
import { ConnectDB } from './config/db.js';
import "dotenv/config";
import cors from "cors";
import userRouter from './routes/userRoute.js';

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
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            // If the origin is in the allowed origins list, allow the request
            callback(null, true);
        } else {
            // Otherwise, reject the request
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(express.json());

ConnectDB();

app.get("/", (req, res) => {
    res.send("Hello world ");
});

app.use("/api/user", userRouter);

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
