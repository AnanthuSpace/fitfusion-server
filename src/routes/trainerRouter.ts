import { Router } from "express";
import { verifyToken } from "../config/jwtConfig";
import { TrainerController } from "../controllers/trainerController";


const router = Router()
const trainerController = new TrainerController()

router.post("/signup", trainerController.registerController);
router.post("/verify", trainerController.otpVerification);
router.post("/login", trainerController.trainerLogin);


export default router