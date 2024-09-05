import { UserType, TrainerType } from "./common/types";

export interface IAdminRepository {
    findAllUsers(): Promise<UserType[]>;
    findAllTrainers(): Promise<TrainerType[]>;
    blockUser(userId: string): Promise<any>; 
    unblockUser(userId: string): Promise<any>; 
    blockTrainer(trainerId: string): Promise<any>; 
    unblockTrainer(trainerId: string): Promise<any>; 
    isVerified(trainerId: string, isVerified: string): Promise<any>; 
    fetchTrainers(page: number): Promise<TrainerType[]>;
    fetchUsers(page: number): Promise<UserType[]>;
}
