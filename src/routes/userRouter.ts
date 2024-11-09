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
import { TutorialVideoModal } from "../models/tutorialVideoModal";

const router = Router()
const userRepository = new UserRepository(userModel, trainerModel, DietPlan, ReviewModal, TutorialVideoModal);
const trainerRepository = new TrainerRepository(trainerModel, userModel, DietPlan, TutorialVideoModal);
const userService = new UserService(userRepository, trainerRepository);
const userController = new UserController(userService);

router.post("/signup", userController.registerController);
router.post("/verify", userController.otpVerification);
router.post("/resent-otp", userController.resendOtp);
router.post("/login", userController.userLogin);
router.post("/google-signup", userController.googleSignUpUser);
router.post("/google-login", userController.googleLoginUser);
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
router.get('/fetchTrainerScroll', userController.fetchTrainerScroll)
router.post('/add-review', verifyToken, userController.addReview)
router.put('/inactive', verifyToken, userController.inactiveUser)
router.get('/get-review', verifyToken, userController.fetchReview)
router.get('/fetch-single-trainer', verifyToken, userController.fetchSingleTrainer)
router.get('/fetch-trainer-videos', verifyToken, userController.fetchVideos)
router.get('/fetch-all-videos', verifyToken, userController.fetchAllVideos)
router.get('/fetch-transaction-history', verifyToken, userController.getTransactionHostory)
router.get('/success', userController.verifyThePayment)
router.get('/single-video', verifyToken, userController.fetchSingleVideo)

export default router