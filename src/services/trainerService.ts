import { TrainerRepository } from "../repositories/trainerRepository";
import { sendMail } from "../config/nodeMailer";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { TrainerType } from "../models/trainerModel";
import { generateAccessToken, generateRefreshToken } from "../config/jwtConfig";
import { EditTrainerInterface } from "../interface/EditUserInterface";
import { UpdateResult } from 'mongodb';



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

        const { password, ...trainerDataWithoutSensitiveInfo } = trainerData;

        return { message: "OTP verified", trainerData: trainerDataWithoutSensitiveInfo };
    }


    async trainerLoginService(email: string, enteredPassword: string) {
        try {
            const trainerData = await this.trainerRepository.findTrainerInRegister(email);

            if (!trainerData) {
                return {
                    trainerNotExisted: true,
                    trainerData: null,
                    accessToken: null,
                    refreshToken: null
                };
            }

            const { password: hashedPassword, ...TrainerDataWithoutSensitiveData } = trainerData;
            const bcryptPass = await bcrypt.compare(enteredPassword, hashedPassword);

            const verifiedTrainer = trainerData.verified
            const isBlocked = trainerData.isBlocked


            const accessToken = generateAccessToken(trainerData.trainerId)
            const refreshToken = generateRefreshToken(trainerData.trainerId)

            return {
                trainerData: TrainerDataWithoutSensitiveData,
                bcryptPass,
                accessToken,
                refreshToken,
                verifiedTrainer,
                isBlocked
            };
        } catch (error) {
            console.error("Error verifying password: ", error);
            return {
                trainerData: null,
                bcryptPass: false
            };
        }
    }


    async editTrainerService(name: string, phone: string, address: string, gender: string, qualification: string, achivements: string, trainerId: string) {
        const editTrainerData: EditTrainerInterface = {
            name,
            phone,
            address,
            gender,
            achivements,
            qualification
        }
        console.log("Edit trainer service : ", editTrainerData)
        const res = await this.trainerRepository.editTrainer(editTrainerData, trainerId)
        console.log("Updation : ", res);

        if (!res.modifiedCount) {
            throw new Error("No changes found")
        }
        return { message: "Updated successfully" };
    }

    async verifyPassword(password: string, trainerId: string): Promise<boolean> {
        try {
            const trainer = await this.trainerRepository.findEditingData(trainerId);
            const storedPassword = trainer?.password;
            const bcryptPass = await bcrypt.compare(password, String(storedPassword));
            return bcryptPass;
        } catch (error) {
            console.error("Error verifying password: ", error);
            return false;
        }
    }

    async changeTrainerPass(newPassword: string, userId: string) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const res = await this.trainerRepository.changePass(hashedPassword, userId);
            if (res.modifiedCount === 0) {
                throw new Error("No changes found");
            }
            return { success: true, message: "Reset Password successfully" };
        } catch (error: any) {
            console.error("Error in reset password: ", error);
            return { success: false, message: error.message || "Internal server error" };
        }
    }

    async profileUpdate(trainerId: string, profileImage: string): Promise<UpdateResult | { success: boolean; message: string }> {
        try {
            const result = await this.trainerRepository.profileUpdate(trainerId, profileImage);
            return result;
        } catch (error: any) {
            console.error('Error in profile update: ', error);
            return { success: false, message: error.message || 'Internal server error' };
        }
    }
}