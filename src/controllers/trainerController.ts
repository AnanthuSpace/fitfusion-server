import { Request, Response } from "express";
import { TrainerRepository } from "../repositories/trainerRepository";
import { TrainerService } from "../services/trainerService";
import { TrainerType } from "../models/trainerModel";
import { generateAccessToken } from "../config/jwtConfig";


const trainerRepository = new TrainerRepository();
const trainerService = new TrainerService(trainerRepository)

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
            console.log("hi", temperoryEmail, completeOtp);

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
            console.log(console.log("trainer details : ", serviceResponse));

            if(serviceResponse.trainerNotExisted){
                return res.status(403).json({ success: false, message: "Invalid email id" });
            }

            if (!serviceResponse.bcryptPass) {
                return res.status(403).json({ success: false, message: "Incorrect password" });
            }

            // if(!serviceResponse.verifiedTrainer){
            //     return res.status(403).json({ success: false, message: "Please wait for the verification" });
            // }

            return res.status(200).json({ success: true, message: "Login successfull", trainerData: serviceResponse.trainerData, accessToken: serviceResponse.accessToken, refreshToken: serviceResponse.refreshToken });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    
    async editTrainerData(req: CustomRequest, res: Response): Promise<any> {
        try {
            console.log(req.body);
            
            const { name, phone, address, gender, qualification, achivements } = req.body;
            const trainerId = req.id as string;
            console.log(qualification);
            
            await trainerService.editTrainerService(name, phone, address, gender, qualification, achivements, trainerId);
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
            console.log(req.body);
            console.log(req.id);
            
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
}