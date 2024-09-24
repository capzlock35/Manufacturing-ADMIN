


import express from 'express';
import {ConnectDB} from './config/db.js';
import "dotenv/config";
import cors from "cors";
import userRouter from './routes/userRoute.js'

const app = express();

const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

ConnectDB(); 


app.get("/", (req, res) => {
    res.send("Hello world ");
  });

app.use("/api/user",userRouter)


app.listen(port, () => {
console.log(`Server Started on http://localhost:${port}`);
});
