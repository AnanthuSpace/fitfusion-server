import { Router } from "express";
import ChatController from '../controllers/chatController';
import { verifyToken } from '../config/jwtConfig';

const router = Router();
const chatController = new ChatController();

router.get('/fetchChat', verifyToken, chatController.fetchChat);

export default router
