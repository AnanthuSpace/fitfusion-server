import { UserRepository } from "../repositories/userRepository";
import { sendMail } from "../config/nodeMailer";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { UserType } from "../models/userModel";
import { generateAccessToken, generateRefreshToken } from "../config/jwtConfig";
import { EditUserInterface } from "../interface/EditUserInterface";

export class UserService {
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

        const accessToken = generateAccessToken(userData.userId);
        const refreshToken = generateRefreshToken(userData.userId);

        const { password, ...userDataWithoutSensitiveInfo } = userData;

        return { message: "OTP verified", accessToken, refreshToken, userData: userDataWithoutSensitiveInfo };
    }

    async userLoginService(email: string) {
        const user = await this.userRepository.findUser(email);
        if (!user) {
            return "Invalid email";
        }

        if(user.isBlocked){
            return "User is blocked by Admin"
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

    async userLoginVerificationService(email: string, otp: string) {
        const storedData = this.otpStore[email];
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

        const user = await this.userRepository.findUser(email);
        if (!user) {
            throw new Error("User not found");
        }

        delete this.otpStore[email];

        const accessToken = generateAccessToken(user.userId);
        const refreshToken = generateRefreshToken(user.userId);

        const { password, ...userDataWithoutSensitiveInfo } = user.toObject();

        return { message: "OTP verified", accessToken, refreshToken, userData: userDataWithoutSensitiveInfo };
    }


    async editUserService(name: string, phone: string, address: string, gender: string, bcryptPass: boolean, password: string, userId: string) {
        const hashPassword = await bcrypt.hash(password, 10);
        const editUserData: EditUserInterface = {
            name,
            phone,
            address,
            gender,
            password: hashPassword,
        }
        console.log("Edit user service : ", editUserData)
        const res = await this.userRepository.editUser(editUserData, userId)
        if (!res.modifiedCount) {
            throw new Error("No changes found")
        }
        return { message: "Updated successfully" };
    }

    async verifyPassword(password: string, userId: string): Promise<boolean> {
        try {
            const user = await this.userRepository.findEditingData(userId);
            const storedPassword = user?.password;
            const bcryptPass = await bcrypt.compare(password, String(storedPassword));
            return bcryptPass;
        } catch (error) {
            console.error("Error verifying password: ", error);
            return false;
        }
    }

    async changeUserPass(newPassword: string, userId: string) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const res = await this.userRepository.changePass(hashedPassword, userId);
            if (res.modifiedCount === 0) {
                throw new Error("No changes found");
            }
            return { success: true, message: "Reset Password successfully" };
        } catch (error: any) {
            console.error("Error in reset password: ", error);
            return { success: false, message: error.message || "Internal server error" };
        }
    }


    async fetchTrainers(){
        try {
            const trainers = await this.userRepository.fetchTrainers()
            return trainers
        } catch (error: any) {
            console.error("Error in reset password: ", error);
            return { success: false, message: error.message || "Internal server error" };
        }
    }


    async addUserDetails(userId: string, userDetails: UserType) {
        try {
            const result = await this.userRepository.addUserDetails(userId, userDetails)
            return result
        } catch (error: any) {
            return { success: false, message: error.message || "Internal server error" };
        }
    }
}
