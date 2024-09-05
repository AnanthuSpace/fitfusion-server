import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { adminVerification } from "../config/jwtConfig";
import { AdminRepository } from "../repositories/adminRepository";
import { AdminService } from "../services/adminService";

const router = Router();

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);


router.post("/", adminController.adminLogin);
router.get("/loadtrainer", adminVerification, adminController.fetchTrainers);
router.get("/loadusers", adminVerification, adminController.fetchUsers);
router.patch("/trainer-block", adminVerification, adminController.trainerBlock);
router.patch("/trainer-unblock", adminVerification, adminController.trainerUnblock);
router.patch("/user-block", adminVerification, adminController.userBlock);
router.patch("/user-unblock", adminVerification, adminController.userUnblock);
router.patch("/isverify", adminVerification, adminController.isVerified);

export default router;