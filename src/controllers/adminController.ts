import { Request, Response } from "express";
import { IAdminService } from "../interfaces/adminService.interface";

export class AdminController {
    private _adminService: IAdminService;

    constructor(_adminService: IAdminService) {
        this._adminService = _adminService;
    }

    adminLogin = async (req: Request, res: Response): Promise<any> => {
        try {
            const { username, password } = req.body;
            const result = await this._adminService.adminLoginService(username, password);

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

    fetchTrainers = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page);
            const response = await this._adminService.fetchTrainers(page);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    fetchUsers = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page);
            const response = await this._adminService.fetchUsers(page);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }


    trainerBlock = async (req: Request, res: Response): Promise<any> => {
        try {
            const { trainerId } = req.body
            const result = await this._adminService.trainerBlock(trainerId)
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
            const result = await this._adminService.trainerUnBlock(trainerId)
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
            const result = await this._adminService.userBlock(userId)
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
            const result = await this._adminService.userUnBlock(userId)
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
            const result = await this._adminService.isVerified(trainerId, isVerified)
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