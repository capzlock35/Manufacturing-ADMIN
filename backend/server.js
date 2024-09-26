


import express from 'express';
import {ConnectDB} from './config/db.js';
import "dotenv/config";
import cors from "cors";
import userRouter from './routes/userRoute.js'

const app = express();

const port = 7690;
app.use(cors({
      credentials: true,
    origin: 'http://localhost:5173'
})
);
app.use(express.json());

ConnectDB(); 


app.get("/", (req, res) => {
    res.send("Hello world ");
  });

app.use("/api/user",userRouter)


app.listen(port, () => {
console.log(`Server Started on http://localhost:${port}`);
});
