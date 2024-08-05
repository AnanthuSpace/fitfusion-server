import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import userRouter from './routes/userRouter';
import adminRouter from './routes/adminRouter';
import trainRouter from "./routes/trainerRouter"
import { dbConnection } from './config/dbConfig';
import cors from "cors"

dbConnection();
const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:5173', 
    optionsSuccessStatus: 200 
  };

app.use(cors(corsOptions));
app.use(express.json())
app.use('/', userRouter)
app.use('/admin', adminRouter)
app.use('/trainer', trainRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
