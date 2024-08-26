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
import { configSocketIO } from './config/socketConfig'; // Ensure this is correctly imported

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);

// Database connection
dbConnection();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};

app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/trainer', trainRouter);
app.use('/chat', chatRouter); 

// Initialize Socket.IO
configSocketIO(server);  // Correct function name

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
