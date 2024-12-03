import { Request, Response, NextFunction } from "express";
import { IAdminService } from "../interfaces/adminService.interface";

export class AdminController {
    private _adminService: IAdminService;

    constructor(_adminService: IAdminService) {
        this._adminService = _adminService;
    }

    adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
            // return res.status(500).json({ success: false, message: "Internal server error" });
            next(error);
        }
    };

    fetchTrainers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = Number(req.query.page);
            const response = await this._adminService.fetchTrainers(page);
            return res.status(200).json(response);
        } catch (error) {
            // return res.status(500).json({ success: false, message: "Internal server error" });
            next(error);
        }
    }

    fetchUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = Number(req.query.page);
            const response = await this._adminService.fetchUsers(page);
            return res.status(200).json(response);
        } catch (error) {
            // return res.status(500).json({ success: false, message: "Internal server error" });
            next(error);
        }
    }


    trainerBlock = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
            // return res.status(500).json({ success: false, message: "Internal server error" });
            next(error)
        }
    }

    trainerUnblock = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
            // return res.status(500).json({ success: false, message: "Internal server error" });
            next(error);
        }
    }


    userBlock = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
            // return res.status(500).json({ success: false, message: "Internal server error" });
            next(error);
        }
    }

    userUnblock = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
            // return res.status(500).json({ success: false, message: "Internal server error" });
            next(error);
        }
    }

    isVerified = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const { trainerId, isVerified, reason } = req.body

            const result = await this._adminService.isVerified(trainerId, isVerified, reason)
            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(403).json(result);
            }
        } catch (error) {
            // return res.status(500).json({ success: false, message: "Internal server error" });
            next(error)
        }
    }

    fetchIndividualTrainer = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const trainerId = req.query.trainerId as string
            const result = await this._adminService.fetchIndividualTrainer(trainerId)
            return res.status(200).json(result);
        } catch (error) {
            // return res.status(500).json({ success: false, message: "Internal server error" });
            next(next)
        }
    }

    fetchDataForDashboard = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const startDateString = req.query.startDate as string;
            const endDateString = req.query.endDate as string;

            const startDate = new Date(startDateString);
            const endDate = new Date(endDateString);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ success: false, message: "Invalid date format" });
            }

            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            const result = await this._adminService.fetchDataForDashboard(startDate, endDate);
            return res.status(200).json(result);
        } catch (error) {
            // return res.status(500).json({ success: false, message: "Internal server error" });
            next(error)
        }
    }

    fetchNewUsersAndTrainers = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const result = await this._adminService.fetchNewUsersAndTrainers()
            return res.status(200).json(result);
        } catch (error) {
            // return res.status(500).json({ success: false, message: "Internal server error" });
            next(error)
        }
    }
}