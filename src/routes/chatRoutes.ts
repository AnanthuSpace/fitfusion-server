// import { Router } from 'express';
// import { ChatController } from '../controllers/chatController';
// import { verifyToken } from '../config/jwtConfig';

// const router = Router();
// const chatController = new ChatController()


// router.post('/fetchChat', verifyToken, chatController.fetchChat)


// export default router;


import express from 'express';
import { fetchChatMessages } from '../controllers/chatController';

const router = express.Router();

// Route to fetch chat messages
router.post('/fetchChat', fetchChatMessages);

export default router;
