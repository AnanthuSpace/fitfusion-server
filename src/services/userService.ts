import { UserRepository } from "../repositories/userRepository";
import { sendMail } from "../config/nodeMailer";
import bcrypt from "bcrypt"
import { v4 } from "uuid"
import { UserType } from "../models/userModel";

export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    async registerUserService(userData: UserType) {
        const alreadyExists = await this.userRepository.findUser(userData.email);
        if (!alreadyExists) {
            // const hashedPassword = await bcrypt.hash(userData.password, 10);
            // userData.password = hashedPassword;
            // userData.userId = v4();
            // return await this.userRepository.registerUser(userData);
            const OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
            console.log(OTP);
            const isMailSended = await sendMail(userData.email, OTP);
            if (isMailSended) return OTP;
            else return "OTP not sended";
        } else {
            return "Email already exists";
        }
    }
}