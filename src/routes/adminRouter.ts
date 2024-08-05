import { Router } from "express";
import { AdminController } from "../controllers/adminController";

const router = Router();
const adminController = new AdminController();

router.post("/", adminController.adminLogin);

export default router;
