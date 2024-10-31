import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import chatRouter from './routes/chatRoutes';
import userRouter from './routes/userRouter';
import adminRouter from './routes/adminRouter';
import trainRouter from './routes/trainerRouter';
import { dbConnection } from './config/dbConfig';
import cors from 'cors';
import http from 'http';
import { configureSocket } from './config/socketConfig';
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const clientURL = process.env.clientURL as string;
const localhostURL = process.env.localhostURL as string

configureSocket(server);

dbConnection();

const corsOptions = {
  origin: [localhostURL, clientURL],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use('/admin', adminRouter);
app.use('/trainer', trainRouter);
app.use('/chat', chatRouter);
app.use('/', userRouter);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
