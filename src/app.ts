import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import userRouter from './routes/userRouter';
import adminRouter from './routes/adminRouter';
import trainRouter from './routes/trainerRouter';
import chatRouter from './routes/chatRoutes';
import { dbConnection } from './config/dbConfig';
import cors from 'cors';
import http from 'http';
import { configureSocket } from './config/socketConfig';
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
import { getObjectURL, putObject, listObjects } from './config/awsConfig';

configureSocket(server);

dbConnection();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', "PUT", "PATCH"],
  credentials: true,
}));

app.use(express.static("public"));
app.use(express.json());

async function init() {
  try {
    // const url = await getObjectURL("/uploads/trainer-uploads/video-1725869123654.mp4");
    const url = await listObjects();
    // const url = await putObject( `video-${Date.now()}.mp4`,"video/mp4")
    console.log("Url image:", url);
  } catch (error) {
    console.error("Error getting the signed URL:", error);
  }
}

init();

app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/trainer', trainRouter);
app.use('/chat', chatRouter);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
