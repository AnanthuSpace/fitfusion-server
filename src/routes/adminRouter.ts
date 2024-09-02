import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { adminVerification } from "../config/jwtConfig";

const router = Router();
const adminController = new AdminController();

router.post("/", adminController.adminLogin);
router.get("/loadtrainer",adminVerification, adminController.fetchTrainers);
router.get("/loadusers",adminVerification, adminController.fetchUsers);
router.patch("/trainer-block",adminVerification, adminController.trainerBlock);
router.patch("/trainer-unblock",adminVerification, adminController.trainerUnblock);
router.patch("/user-block",adminVerification, adminController.userBlock);
router.patch("/user-unblock",adminVerification, adminController.userUnblock);
router.patch("/isverify",adminVerification, adminController.isVerified);

export default router;