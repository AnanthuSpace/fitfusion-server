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
           console.log(userData)
           const serviceResponse = await userService.registerUserService(userData);
           res.json({ serviceResponse, userData });
        } catch (error) {
           console.log(error);
        }
     }
}
