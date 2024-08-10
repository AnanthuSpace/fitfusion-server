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
}