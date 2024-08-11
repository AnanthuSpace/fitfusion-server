import { Request, Response } from "express";
import { AdminService } from "../services/adminService";
import { AdminRepository } from "../repositories/adminRepository";

export class AdminController {
    private adminService: AdminService;

    constructor() {
        const adminRepository = new AdminRepository();
        this.adminService = new AdminService(adminRepository);
    }

    adminLogin = async (req: Request, res: Response): Promise<any> => {
        try {
            const { username, password } = req.body;
            const result = await this.adminService.adminLoginService(username, password);

            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(403).json(result);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    };


    trainerBlock = async (req: Request, res: Response): Promise<any> => {
        try {
            const { trainerId } = req.body
            const result = await this.adminService.trainerBlock(trainerId)
            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(403).json(result);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    trainerUnblock = async (req: Request, res: Response): Promise<any> => {
        try {
            const { trainerId } = req.body
            const result = await this.adminService.trainerUnBlock(trainerId)
            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(403).json(result);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }


    userBlock = async (req: Request, res: Response): Promise<any> => {
        try {
            const { userId } = req.body
            const result = await this.adminService.userBlock(userId)
            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(403).json(result);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    userUnblock = async (req: Request, res: Response): Promise<any> => {
        try {
            const { userId } = req.body
            const result = await this.adminService.userUnBlock(userId)
            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(403).json(result);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    isVerified = async (req: Request, res: Response): Promise<any> => {
        try {
            const { trainerId, isVerified } = req.body
            const result = await this.adminService.isVerified(trainerId, isVerified)
            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(403).json(result);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}