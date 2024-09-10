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

configureSocket(server);

dbConnection();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', "PUT", "PATCH"],
  credentials: true,
}));

app.use(express.static("public"));
app.use(express.json());

app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/trainer', trainRouter);
app.use('/chat', chatRouter);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
