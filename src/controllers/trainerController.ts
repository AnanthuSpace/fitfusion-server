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

            if (serviceResponse.trainerNotExisted) {
                return res.status(403).json({ success: false, message: "Invalid email id" });
            }

            if (!serviceResponse.bcryptPass) {
                return res.status(403).json({ success: false, message: "Incorrect password" });
            }


            if (!serviceResponse.verifiedTrainer) {
                return res.status(403).json({ success: false, message: "Please wait for the verification" });
            }

            return res.status(200).json({ success: true, message: "Login successfull", trainerData: serviceResponse.trainerData, accessToken: serviceResponse.accessToken, refreshToken: serviceResponse.refreshToken });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}