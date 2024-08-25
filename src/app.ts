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
import { Server as SocketIOServer } from 'socket.io';
import socketConfig from './config/socketConfig';

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

dbConnection();

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};

app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(express.json());


app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/trainer', trainRouter);
app.use('/chat', chatRouter); 


socketConfig(io);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
