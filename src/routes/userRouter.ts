import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router()
const userController = new UserController()

router.post("/signup", userController.registerController);

export default router