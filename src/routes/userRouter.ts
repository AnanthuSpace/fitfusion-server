import { Router } from "express";
import { UserController } from "../controllers/userController";
import { verifyToken } from "../config/jwtConfig";
import { UserRepository } from "../repositories/userRepository";
import { UserService } from "../services/userService";
import { TrainerRepository } from "../repositories/trainerRepository";
import { userModel } from "../models/userModel";
import { trainerModel } from "../models/trainerModel";
import DietPlan from "../models/dietModal";
import { ReviewModal } from "../models/reviewModal";

const router = Router()
const userRepository = new UserRepository(userModel, trainerModel, DietPlan, ReviewModal); 
const trainerRepository = new TrainerRepository(trainerModel, userModel, DietPlan);
const userService = new UserService(userRepository, trainerRepository);
const userController = new UserController(userService);

router.post("/signup", userController.registerController);
router.post("/verify", userController.otpVerification);
router.post("/login", userController.userLogin);
router.post("/login-verify", userController.loginVerify);
router.put('/edit-user', verifyToken, userController.editUserData);
router.patch('/change-userpass', verifyToken, userController.changeUserPassword);
router.put('/user-details', verifyToken, userController.addUserDetails)
router.post('/blockuser', userController.blockeAUser)
router.get('/fetch-trainers', userController.fetchTrainers)
router.get('/fetch-user-trainer', verifyToken, userController.fetchUserTrainer)
router.post('/create-checkout-session', verifyToken, userController.createCheckoutSession)
router.post('/getTrainerByIds', verifyToken, userController.fetchAlreadyChattedTrainer)
router.get('/fetchDeitPlans', verifyToken, userController.fetchDeitPlans)
router.get('/fetchTrainerScroll', verifyToken, userController.fetchTrainerScroll)
router.post('/add-review',verifyToken, userController.addReview)
router.put('/inactive', verifyToken, userController.inactiveUser)

export default router