import { TrainerRepository } from "../repositories/trainerRepository";
import { sendMail } from "../config/nodeMailer";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { TrainerType } from "../models/trainerModel";
import { generateAccessToken, generateRefreshToken } from "../config/jwtConfig";



export class TrainerService {
    private trainerRepository: TrainerRepository;
    private otpStore: { [key: string]: { otp: string; timestamp: number; trainerData: TrainerType } } = {};

    constructor(trainerRepository: TrainerRepository) {
        this.trainerRepository = trainerRepository;
    }


    async registerTrainerService(trainerData: TrainerType) {
        const alreadyExists = await this.trainerRepository.findTrainerInRegister(trainerData.email);
        if (alreadyExists) {
            return "UserExist";
        }

        const OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("Generated OTP: ", OTP);
        const isMailSended = await sendMail(trainerData.email, OTP);
        if (isMailSended) {
            this.storeOtp(trainerData.email, OTP, trainerData);
            console.log("OTP stored successfully");
            return OTP;
        } else {
            return "OTP not sent";
        }
    }


    storeOtp(email: string, otp: string, trainerData: TrainerType) {
        const timestamp = Date.now();
        this.otpStore[email] = { otp, timestamp, trainerData };
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

        const trainerData = storedData.trainerData;
        const hashedPassword = await bcrypt.hash(trainerData.password, 10);
        trainerData.password = hashedPassword;
        trainerData.trainerId = v4();
        delete this.otpStore[temperoryEmail];

        await this.trainerRepository.registerTrainer(trainerData);

        const accessToken = generateAccessToken(trainerData.trainerId);
        const refreshToken = generateRefreshToken(trainerData.trainerId);

        const { password, ...trainerDataWithoutSensitiveInfo } = trainerData;

        return { message: "OTP verified", accessToken, refreshToken, trainerData: trainerDataWithoutSensitiveInfo };
    }


    async trainerLoginService(email: string, password: string) {
        try {
            const trainerData = await this.trainerRepository.findTrainerInRegister(email);
            console.log(trainerData);
            const storedPassword = trainerData?.password;
            const bcryptPass = await bcrypt.compare(password, String(storedPassword))
            return bcryptPass
        } catch (error) {
            console.error("Error verifying password: ", error);
            return false;
        }
    }
}