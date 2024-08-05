import { Request, Response } from "express";
import { TrainerRepository } from "../repositories/trainerRepository";
import { TrainerService } from "../services/trainerService";
import { TrainerType } from "../models/trainerModel";


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
            console.log("hi",temperoryEmail, completeOtp);
            
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
            const {email, password} = req.body
            console.log(email,password);
            const serviceResponse = await trainerService.trainerLoginService(email,password)
            console.log(serviceResponse);
            if(!serviceResponse) {
                return res.status(403).json({ success: false, message: "Incorrect password" });
            }
            return res.status(200).json({ success: true, message: "Login successfull" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}