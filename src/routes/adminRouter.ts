import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { adminVerification } from "../config/jwtConfig";
import { AdminRepository } from "../repositories/adminRepository";
import { AdminService } from "../services/adminService";
import { trainerModel } from "../models/trainerModel";
import { userModel } from "../models/userModel";

const router = Router();

const adminRepository = new AdminRepository(trainerModel, userModel);
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
router.get("/get-individual-trainers", adminVerification, adminController.fetchIndividualTrainer);

export default router;