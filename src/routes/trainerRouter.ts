import { Router } from "express";
import { verifyToken } from "../config/jwtConfig";
import { TrainerController } from "../controllers/trainerController";
import upload from "../config/multerConfig";
import { TrainerRepository } from "../repositories/trainerRepository";
import { TrainerService } from "../services/trainerService";
import { trainerModel } from "../models/trainerModel";
import { userModel } from "../models/userModel";
import DietPlan from "../models/dietModal";
import { TutorialVideoModal } from "../models/tutorialVideoModal";

const router = Router()
const trainerRepository = new TrainerRepository(trainerModel, userModel, DietPlan, TutorialVideoModal)
const trainerService = new TrainerService(trainerRepository);
const trainerController = new TrainerController(trainerService)

router.post("/signup", trainerController.registerController);
router.post("/verify", trainerController.otpVerification);
router.post("/login", trainerController.trainerLogin);
router.post("/google-login", trainerController.googleLogin);
router.post("/google-signup", trainerController.googleSignUp)
router.put("/edit-trainer", verifyToken, trainerController.editTrainerData)
router.put("/profile-picture", verifyToken, upload.single("profileImage"), trainerController.profileUpdate)
router.patch('/change-trainerpass', verifyToken, trainerController.changeTrainerPassword);
router.post('/customers', verifyToken, trainerController.fetchCustomer);
router.post('/add-diet', verifyToken, trainerController.addDietPlan);
router.get('/fetch-deit', verifyToken, trainerController.fetchDeitPlans);
router.post('/getUsersByIds', verifyToken, trainerController.fetchAlreadyChatted);
router.put('/upload-video', verifyToken, upload.fields([{ name: 'videoFile', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), trainerController.uploadVideo);
router.put('/edit-video', verifyToken, trainerController.editVideo);
router.get(`/get-profile`, verifyToken, trainerController.profileFetch)
router.get(`/get-videos`, verifyToken, trainerController.getVideos)
router.get(`/fetch-transaction-history`, verifyToken, trainerController.getTransaction)
router.patch(`/toggleListing`, verifyToken, trainerController.toggleVideoListing)
router.get(`/dashboard-data`, verifyToken, trainerController.getDashBoardData)
router.get(`/totalcounts`, verifyToken, trainerController.getTotalCountOfTrainerData)
router.get(`/fetch-review`, verifyToken, trainerController.getAllReview)

export default router