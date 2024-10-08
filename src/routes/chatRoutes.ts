import { Router } from "express";
import { ChatRepository } from "../repositories/chatRepository";
import { userRepository } from "../repositories/userRepository";
import { TrainerRepository } from "../repositories/trainerRepository";
import ChatController from '../controllers/chatController';
import { verifyToken } from '../config/jwtConfig';
import ChatService from "../services/chatService";
import { chatModel } from "../models/chatModal";
import { userModel } from "../models/userModel";
import { trainerModel } from "../models/trainerModel";
import DietPlan from "../models/dietModal";
import { TutorialVideoModal } from "../models/tutorialVideoModal";
import { ReviewModal } from "../models/reviewModal";

const router = Router();

const chatRepository = new ChatRepository(chatModel);
const trainerRepository = new TrainerRepository(trainerModel, userModel, DietPlan, TutorialVideoModal);
const UserRepository = new userRepository(userModel, trainerModel, DietPlan,ReviewModal, TutorialVideoModal);

const chatService = new ChatService(chatRepository, UserRepository, trainerRepository);
const chatController = new ChatController(chatService);

router.get('/fetchChat', verifyToken, chatController.fetchChat);

export default router
