import { FullReviewType, UserType } from "./common/types";
import { PaymentSessionResponse } from "./common/Interfaces";

export interface UserServiceInterface {
    registerUserService(userData: UserType): Promise<string | number>;
    otpVerificationService(temperoryEmail: string, otp: string): Promise<{ message: string; accessToken: string; refreshToken: string; userData: Partial<UserType> }>;
    userLoginService(email: string): Promise<string>;
    userLoginVerificationService(email: string, otp: string): Promise<{ message: string; accessToken: string; refreshToken: string; userData: Partial<UserType> }>;
    googleSignUpUser(token: string, password: string): Promise<any>
    inactiveUser(userId: string): Promise<any>;
    googleLoginUser(token: string): Promise<any>
    editUserService(name: string, phone: string, address: string, gender: string, password: string, userId: string, weight: string, heigth: string, activityLevel: string, goals: string, dietary: string, medicalDetails: string): Promise<{ message: string }>;
    verifyPassword(password: string, userId: string): Promise<boolean>;
    changeUserPass(newPassword: string, userId: string): Promise<{ success: boolean; message: string }>;
    fetchTrainers(): Promise<any>;
    addUserDetails(userId: string, userDetails: UserType): Promise<any>;
    blockUser(userId: string): Promise<any>;
    createCheckoutSession(trainerId: string, trainerName: string, amount: number, userId: string, userName: string): Promise<PaymentSessionResponse>;
    fetchUserTrainer(userId: string): Promise<{ trainersData: any; userData: any; success?: boolean; message?: string }>;
    fetchAlreadyChattedTrainer(alreadyChatted: string[]): Promise<any>;
    fetchDeitPlans(trainerId: string): Promise<any>;
    fetchTrainerScroll(page: number): Promise<any>;
    addReview(params: { trainerId: string; reviewData: FullReviewType; curruntRating: number; reviewCount: number }): Promise<number | { success: boolean; message: string }>;
    fetchReview(trainerId: string): Promise<any>
    fetchSingleTrainer(trainerId: string): Promise<any>
    fetchVideos(trainerId: string): Promise<any>
    fetchAllVideos(trainerIds: string[]): Promise<any>
    getTransactionHostory(userId: string): Promise<any>
    verifyThePayment(session_id: string): Promise<any>
}
