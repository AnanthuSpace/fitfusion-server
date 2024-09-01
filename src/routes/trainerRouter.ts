import { Router } from "express";
import { verifyToken } from "../config/jwtConfig";
import { TrainerController } from "../controllers/trainerController";
import upload from "../config/multerConfig";

const router = Router()
const trainerController = new TrainerController()

router.post("/signup", trainerController.registerController);
router.post("/verify", trainerController.otpVerification);
router.post("/login", trainerController.trainerLogin);
router.put("/edit-trainer", verifyToken, trainerController.editTrainerData)
router.put("/profile-picture", verifyToken,  upload.single("profileImage"),  trainerController.profileUpdate)
router.patch('/change-trainerpass', verifyToken,trainerController.changeTrainerPassword);
router.post('/customers', verifyToken,trainerController.fetchCustomer);
router.post('/add-diet', verifyToken,trainerController.addDietPlan);
router.get('/fetch-deit', verifyToken,trainerController.fetchDeitPlans);
router.post('/getUsersByIds', verifyToken,trainerController.fetchAlreadyChatted);
// router.post('/instent-chat-with-user', verifyToken,trainerController.instantChatWithCustomer);


export default router