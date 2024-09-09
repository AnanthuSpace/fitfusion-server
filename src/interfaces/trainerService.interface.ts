import { TrainerType } from "./common/types";
import { IDietPlan } from "./common/Interfaces";
import { UpdateResult } from "mongodb";

export interface ITrainerService {
    registerTrainerService(trainerData: TrainerType): Promise<string | number>;
    storeOtp(email: string, otp: string, trainerData: TrainerType): void;
    otpVerificationService(temperoryEmail: string, otp: string): Promise<{ message: string; trainerData: Omit<TrainerType, "password"> }>;
    trainerLoginService(email: string, enteredPassword: string): Promise<{ trainerNotExisted?: boolean; trainerData: Omit<TrainerType, "password"> | null; bcryptPass: boolean; accessToken?: string; refreshToken?: string; verifiedTrainer?: "pending" | "rejected" | "verified"; isBlocked?: boolean; }>;
    editTrainerService(name: string, phone: string, address: string, gender: string, qualification: string, achivements: string, trainerId: string, feePerMonth: string, experience: string): Promise<{ message: string }>;
    verifyPassword(password: string, trainerId: string): Promise<boolean>;
    changeTrainerPass(newPassword: string, userId: string): Promise<{ success: boolean; message: string }>;
    profileUpdate(trainerId: string, profileImage: string): Promise<UpdateResult | { success: boolean; message: string }>;
    fetchCustomer(userIds: string[]): Promise<any>;
    fetchDeitPlans(trainerId: string): Promise<any>;
    addDietPlan(trainerId: string, dietPlan: Omit<IDietPlan, "trainerId">): Promise<any>;
    fetchAlreadyChatted(alreadyChatted: string[]): Promise<any>;
    saveVideoUrl(trainerId: string, videoUrl: string): Promise<any>;
}

