import { UserRepository } from "../repositories/userRepository";
import { sendMail } from "../config/nodeMailer";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { UserType } from "../models/userModel";

export class UserService { // Export the class here
    private userRepository: UserRepository;
    private otpStore: { [key: string]: { otp: string; timestamp: number; userData: UserType } } = {};

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async registerUserService(userData: UserType) {
        const alreadyExists = await this.userRepository.findUser(userData.email);
        if (alreadyExists) {
            return "UserExist";
        }

        const OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("Generated OTP: ", OTP);
        const isMailSended = await sendMail(userData.email, OTP);
        if (isMailSended) {
            this.storeOtp(userData.email, OTP, userData);
            console.log("OTP stored successfully");
            return OTP;
        } else {
            return "OTP not sent";
        }
    }

    storeOtp(email: string, otp: string, userData: UserType) {
        const timestamp = Date.now();
        this.otpStore[email] = { otp, timestamp, userData };
        console.log("Stored OTP data: ", this.otpStore); 
    }

    async otpVerificationService(temperoryEmail: string, otp: string) {
        console.log("Current OTP store: ", this.otpStore); 
        console.log("Verifying OTP for email: ", temperoryEmail);
        
        const storedData = this.otpStore[temperoryEmail];
        console.log("storedData: ", storedData); 

        if (!storedData) {
            throw new Error("Invalid OTP");
        }

        const currentTime = Date.now();
        const otpTime = storedData.timestamp;
        const difference = currentTime - otpTime;

        if (difference > 2 * 60 * 1000) {
            throw new Error("OTP expired");
        }

        if (storedData.otp !== otp) {
            throw new Error("Invalid OTP");
        }

        console.log("OTP matched");

        const userData = storedData.userData;
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
        userData.userId = v4();
        delete this.otpStore[temperoryEmail];

        await this.userRepository.registerUser(userData);
        return { message: "OTP verified", userData };
    }

    async userLoginService(email: string){
        const user = await this.userRepository.findUser(email)
        if(!user){
            return "Invalid email"
        }
        const OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
        const isMailSended = await sendMail(email, OTP);
        if (isMailSended) {
            this.storeOtp(email, OTP, user);
            console.log("OTP stored successfully");
            return email;
        } else {
            return "OTP not sent";
        }
    }
}
