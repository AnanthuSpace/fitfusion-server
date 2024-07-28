import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import { UserService } from "../services/userService";
import { UserType } from "../models/userModel";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
   async registerController(req: Request, res: Response): Promise<void> {
      try {
         const userData: UserType = req.body;
         const serviceResponse = await userService.registerUserService(userData);
         if (serviceResponse === "UserExist") {
            console.log(serviceResponse);
            res.status(409).json({ success: false, message: "User already exists" });
         } else {
            res.status(200).json({ success: true, message: "OTP sent", otp: serviceResponse });
         }
      } catch (error) {
         console.error(error);
         res.status(500).json({ success: false, message: "Internal server error" });
      }
   }

   async otpVerification(req: Request, res: Response): Promise<void> {
      try {
         const { temperoryEmail, completeOtp } = req.body;
         const serviceResponse = await userService.otpVerificationService(temperoryEmail, completeOtp);
         console.log(serviceResponse);

         if (serviceResponse.message === "OTP verified") {
            res.status(200).json(serviceResponse);
         } else {
            res.status(400).json(serviceResponse);
         }
      } catch (error) {
         console.error(error);
         res.status(500).json({ success: false, message: "Internal server error" });
      }
   }

   async userLogin(req: Request, res: Response): Promise<void> {
      try {
         const  email: string  = req.body.email
         const serviceResponse = await userService.userLoginService(email)
         console.log("responds :",serviceResponse)
         res.status(200).json(serviceResponse)
      } catch (error) {
         console.error(error);
         res.status(500).json({ success: false, message: "Internal server error" });
      }
   }

   async loginVerify(req: Request, res: Response): Promise<void> {
      try {
         const { temperoryEmail, completeOtp } = req.body;
         console.log("Email", temperoryEmail)
         const serviceResponse = await userService.otpVerificationService(temperoryEmail, completeOtp);
         console.log(serviceResponse);

         if (serviceResponse.message === "OTP verified") {
            res.status(200).json(serviceResponse);
         } else {
            res.status(400).json(serviceResponse);
         }
      } catch (error) {
         console.error(error);
         res.status(500).json({ success: false, message: "Internal server error" });
      }
   }
}
