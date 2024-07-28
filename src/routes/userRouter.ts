import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router()
const userController = new UserController()

router.post("/signup", userController.registerController);
router.post("/verify", userController.otpVerification);
router.post("/login", userController.userLogin);
router.post("/login-verify", userController.loginVerify);


export default router