import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { UserType } from "../models/userModel";


const userService = new UserService();

interface CustomRequest extends Request {
    id?: string;
}

export class UserController {
    async registerController(req: Request, res: Response): Promise<any> {
        try {
            const userData: UserType = req.body;
            const serviceResponse = await userService.registerUserService(userData);
            if (serviceResponse === "UserExist") {
                return res.status(409).json({ success: false, message: "User already exists" });
            } else {
                return res.status(200).json({ success: true, message: "OTP sent", otp: serviceResponse });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async otpVerification(req: Request, res: Response): Promise<any> {
        try {
            const { temperoryEmail, completeOtp } = req.body;
            const serviceResponse = await userService.otpVerificationService(temperoryEmail, completeOtp);

            if (serviceResponse.message === "OTP verified") {
                return res.status(200).json(serviceResponse);
            } else {
                return res.status(400).json(serviceResponse);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async userLogin(req: Request, res: Response): Promise<any> {
        try {
            const email: string = req.body.email;
            const serviceResponse = await userService.userLoginService(email);
            
            if (serviceResponse === "Invalid email") {
                return res.status(400).json({ success: false, message: "User not exist please register" });
            }

            if (serviceResponse === "User is blocked by Admin") {
                return res.status(400).json({ success: false, message: "User is blocked by Admin" });
            }

            return res.status(200).json({ success: true, message: "OTP sent", data: serviceResponse });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async loginVerify(req: Request, res: Response): Promise<any> {
        try {
            const { temperoryEmail, completeOtp } = req.body;
            
            const serviceResponse = await userService.userLoginVerificationService(temperoryEmail, completeOtp);
        
            if (serviceResponse.message === "OTP verified") {
                return res.status(200).json(serviceResponse);
            } else {
                return res.status(400).json(serviceResponse);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async editUserData(req: CustomRequest, res: Response): Promise<any> {
        try {
            const { name, phone, address, gender, password, weight, heigth, activityLevel, goals, dietary, medicalDetails } = req.body;
            const userId = req.id as string;
            const bcryptPass = await userService.verifyPassword(password, userId);
            if (!bcryptPass) {
                return res.status(403).json({ success: false, message: "Invalid password" });
            }
            await userService.editUserService(name, phone, address, gender, password, userId, weight, heigth, activityLevel, goals, dietary, medicalDetails);
            return res.status(200).json({ success: true, message: "Updated successfully" });
        } catch (error: any) {
            if (error.message === "No changes found") {
                return res.status(304).json({ success: false, message: "No changes found" });
            }
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async changeUserPassword(req: CustomRequest, res: Response): Promise<any> {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.id as string;
            const bcryptPass = await userService.verifyPassword(oldPassword, userId);
            if (!bcryptPass) {
                return res.status(403).json({ success: false, message: "Current password is incorrect" });
            }
            const serviceResponse = await userService.changeUserPass(newPassword, userId);
            if (serviceResponse.message === "No changes found") {
                return res.status(304).json({ success: false, message: "No changes found" });
            }
            return res.status(200).json({ success: true, message: "Password updated successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async blockeAUser(req: Request, res: Response): Promise<any> {
        try {
            const { userId } = req.body
            const responds = await userService.blockUser(userId)
            if (responds) {
                return res.status(200).json({ success: true, message: "User blocked" });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async fetchTrainers(req: Request, res: Response): Promise<any> {
        try {
            const trainers = await userService.fetchTrainers()
            if (trainers) {
                return res.status(200).json(trainers)
            }
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async addUserDetails(req: CustomRequest, res: Response): Promise<any> {
        try {
            const { userDetails } = req.body
            const userId = req.id as string;
            const response = await userService.addUserDetails(userId, userDetails)

            if ('modifiedCount' in response) {
                if (response.modifiedCount === 0) {
                    return res.status(304).json({ success: false, message: 'No changes made' });
                } else {
                    return res.status(200).json({ success: true, message: 'Profile updated successfully' });
                }
            } else {
                return res.status(500).json({ success: false, message: response.message });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}
