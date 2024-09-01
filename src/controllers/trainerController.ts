import { Request, Response } from "express";
import { TrainerService } from "../services/trainerService";
import { TrainerType } from "../models/trainerModel";

const trainerService = new TrainerService()

interface CustomRequest extends Request {
    id?: string;
}

export class TrainerController {
    async registerController(req: Request, res: Response): Promise<any> {
        try {
            const trainerData: TrainerType = req.body;
            const serviceResponse = await trainerService.registerTrainerService(trainerData);
            if (serviceResponse === "UserExist") {
                console.log(serviceResponse);
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
            const serviceResponse = await trainerService.otpVerificationService(temperoryEmail, completeOtp);
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

    async trainerLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body
            const serviceResponse = await trainerService.trainerLoginService(email, password)
            if (serviceResponse.trainerNotExisted) {
                return res.status(403).json({ success: false, message: "Invalid email id" });
            }
            if (serviceResponse.isBlocked) {
                return res.status(403).json({ success: false, message: "Trainer is Blocked by admin" });
            }
            if (!serviceResponse.bcryptPass) {
                return res.status(403).json({ success: false, message: "Incorrect password" });
            }
            if (serviceResponse.verifiedTrainer === "pending") {
                return res.status(403).json({ success: false, message: "Please wait for the verification" });
            }
            if (serviceResponse.verifiedTrainer === "rejected") {
                return res.status(403).json({ success: false, message: "You are rejected by Admin" });
            }
            return res.status(200).json({ success: true, message: "Login successfull", trainerData: serviceResponse.trainerData, accessToken: serviceResponse.accessToken, refreshToken: serviceResponse.refreshToken });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async editTrainerData(req: CustomRequest, res: Response): Promise<any> {
        try {
            const { name, phone, address, gender, qualification, achivements, feePerMonth, experience } = req.body;
            const trainerId = req.id as string;
            const data = await trainerService.editTrainerService(name, phone, address, gender, qualification, achivements, trainerId, feePerMonth, experience);
            console.log("Data : ", data);
            return res.status(200).json({ success: true, message: "Updated successfully" });
        } catch (error: any) {
            if (error.message === "No changes found") {
                return res.status(304).json({ success: false, message: "No changes found" });
            }
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async changeTrainerPassword(req: CustomRequest, res: Response): Promise<any> {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.id as string;
            const bcryptPass = await trainerService.verifyPassword(oldPassword, userId);
            if (!bcryptPass) {
                return res.status(403).json({ success: false, message: "Current password is incorrect" });
            }
            const serviceResponse = await trainerService.changeTrainerPass(newPassword, userId);
            if (serviceResponse.message === "No changes found") {
                return res.status(304).json({ success: false, message: "No changes found" });
            }
            return res.status(200).json({ success: true, message: "Password updated successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async profileUpdate(req: CustomRequest, res: Response): Promise<any> {
        try {
            const trainerId = req.id as string;
            const profileImage = req.file?.filename;
            if (!profileImage) {
                return res.status(400).json({ success: false, message: 'No profile image uploaded' });
            }
            const response = await trainerService.profileUpdate(trainerId, profileImage);
            if ('modifiedCount' in response) {
                if (response.modifiedCount === 0) {
                    return res.status(304).json({ success: false, message: 'No changes made' });
                } else {
                    return res.status(200).json({ success: true, message: 'Profile updated successfully', profileImage: profileImage });
                }
            } else {
                return res.status(500).json({ success: false, message: response.message });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async fetchCustomer(req: Request, res: Response) {
        try {
            const { userIds } = req.body
            const response = await trainerService.fetchCustomer(userIds)
            console.log("Response : ", response);
            return res.status(200).json({ success: true, message: 'Fetch Customers', customers: response });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async fetchDeitPlans(req: CustomRequest, res: Response) {
        try {
            const trainerId = req.id as string;
            const response = await trainerService.fetchDeitPlans(trainerId)
            return res.status(200).json({ success: true, message: 'Fetch Diets', diet: response });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async addDietPlan(req: CustomRequest, res: Response) {
        try {
            const trainerId = req.id as string;
            const { dietPlan } = req.body
            const response = await trainerService.addDietPlan(trainerId, dietPlan)
            if ('_id' in response) {
                const { _id, ...responseWithoutId } = response;
                return res.status(200).json({
                    success: true,
                    data: responseWithoutId,
                    message: 'Diet plan added successfully',
                });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

//    async instantChatWithCustomer( req: CustomRequest, res: Response) {
//     try {
//         const trainerId = req.id as string
//         const { userId } = req.body
//         // const response = await trainerService.instantChatWithCustomer()
//     } catch (error) {
//         return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//    }
}