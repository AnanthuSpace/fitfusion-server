import { TrainerType } from "./common/types";
import { IDietPlan } from "./common/Interfaces";
import { ProfileUpdateResult } from "./common/Interfaces";

export interface ITrainerService {
    registerTrainerService(trainerData: TrainerType): Promise<string | number>;
    storeOtp(email: string, otp: string, trainerData: TrainerType): void;
    otpVerificationService(temperoryEmail: string, otp: string): Promise<{ message: string; trainerData: Omit<TrainerType, "password"> }>;
    trainerLoginService(email: string, enteredPassword: string): Promise<{ trainerNotExisted?: boolean; trainerData: Omit<TrainerType, "password"> | null; bcryptPass: boolean; accessToken?: string; refreshToken?: string; verifiedTrainer?: "pending" | "rejected" | "verified"; isBlocked?: boolean; }>;
    editTrainerService(name: string, phone: string, address: string, gender: string, qualification: string, achivements: string, trainerId: string, feePerMonth: string, experience: string): Promise<{ message: string }>;
    verifyPassword(password: string, trainerId: string): Promise<boolean>;
    changeTrainerPass(newPassword: string, userId: string): Promise<{ success: boolean; message: string }>;
    profileUpdate(trainerId: string, profileImage: any): Promise<ProfileUpdateResult | { success: boolean; message: string } | any>;
    fetchCustomer(userIds: string[]): Promise<any>;
    fetchDeitPlans(trainerId: string): Promise<any>;
    addDietPlan(trainerId: string, dietPlan: Omit<IDietPlan, "trainerId">): Promise<any>;
    fetchAlreadyChatted(alreadyChatted: string[]): Promise<any>;
    saveVideoUrl(trainerId: string, videoFile: any, thumbnail: any, title: string, description: string): Promise<any>;
    profileFetch(trainerId: string): Promise<any>;
}

