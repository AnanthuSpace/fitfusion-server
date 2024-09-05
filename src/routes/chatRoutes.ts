import { Router } from "express";
import { ChatRepository } from "../repositories/chatRepository";
import { UserRepository } from "../repositories/userRepository";
import { TrainerRepository } from "../repositories/trainerRepository";
import ChatController from '../controllers/chatController';
import { verifyToken } from '../config/jwtConfig';
import ChatService from "../services/chatService";

const router = Router();

const chatRepository = new ChatRepository();
const userRepository = new UserRepository();
const trainerRepository = new TrainerRepository();

const chatService = new ChatService(chatRepository, userRepository, trainerRepository);
const chatController = new ChatController(chatService);

router.get('/fetchChat', verifyToken, chatController.fetchChat);

export default router
