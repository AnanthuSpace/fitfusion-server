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
import { getObjectURL } from './config/awsConfig';

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
    const url = await getObjectURL("Kp.jpg");
    console.log("Url image:", url);
  } catch (error) {
    console.error("Error getting the signed URL:", error);
  }
}

init();

// const s3Client = new S3Client({
//   region: "ap-south-1",
//   credentials: {
//     accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
//     secretAccessKey: process.env.AWS_S3_SECRET_KEY as string,
//   }
// });

// const getObjectURL = async (key: string): Promise<string> => {
//   const command = new GetObjectCommand({
//     Bucket: "fitfusion-store",
//     Key: key
//   });

//   const url = await getSignedUrl(s3Client, command, { expiresIn: 20});
//   return url;
// }


// async function init() {
//   try {
//     const url = await getObjectURL("Kp.jpg");
//     console.log("Url image:", url);
//   } catch (error) {
//     console.error("Error getting the signed URL:", error);
//   }
// }

// init();



app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/trainer', trainRouter);
app.use('/chat', chatRouter);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
