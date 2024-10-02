import { UserType, TrainerType } from "./common/types";

export interface IAdminService {
    adminLoginService(username: string, password: string): Promise<{ success: boolean; message: string; accessToken?: string; refreshToken?: string; usersData?: UserType[]; trainersData?: TrainerType[] }>;
    trainerBlock(trainerId: string): Promise<{ success: boolean; message: string }>;
    trainerUnBlock(trainerId: string): Promise<{ success: boolean; message: string }>;
    userBlock(userId: string): Promise<{ success: boolean; message: string }>;
    userUnBlock(userId: string): Promise<{ success: boolean; message: string }>;
    isVerified(trainerId: string, isVerified: string, reason?: string): Promise<{ success: boolean; message: string }>;
    fetchTrainers(page: number): Promise<TrainerType[]>;
    fetchUsers(page: number): Promise<UserType[]>;
    fetchIndividualTrainer(trainerId: string): Promise<any>
    fetchDataForDashboard(startDate: string | Date, endDate: string | Date): Promise<any>;
    fetchNewUsersAndTrainers(): Promise<any>
}
