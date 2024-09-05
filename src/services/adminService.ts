import { generateAccessTokenForAdmin, generateRefreshToken } from "../config/jwtConfig";
import { IAdminService } from "../interfaces/adminService.interface";
import { IAdminRepository } from "../interfaces/adminRepository.interface";

export class AdminService implements IAdminService  {
    private _adminRepository: IAdminRepository

    constructor(adminRepository: IAdminRepository) {
        this._adminRepository = adminRepository
    }
    async adminLoginService(username: string, password: string) {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (username === adminUsername && password === adminPassword) {
            const accessToken = generateAccessTokenForAdmin(username);
            const refreshToken = generateRefreshToken(username);
            const usersData = await this._adminRepository.findAllUsers()
            const trainersData = await this._adminRepository.findAllTrainers()
            return { success: true, message: "Login successful", accessToken, refreshToken, usersData, trainersData };
        } else {
            return { success: false, message: "Invalid Username and password" };
        }
    }

    async trainerBlock(trainerId: string){
        const result = await this._adminRepository.blockTrainer(trainerId)
        if(result.modifiedCount){
            return { success: true, message: "Trainer is blocked"};
        } else {
            return { success: false, message: "Trainer blocking failed" };
        }
    }

    async trainerUnBlock(trainerId: string){
        const result = await this._adminRepository.unblockTrainer(trainerId)
        if(result.modifiedCount){
            return { success: true, message: "Trainer is unblocked"};
        } else {
            return { success: false, message: "Trainer unblocking is failed" };
        }
    }

    async userBlock(userId: string){
        const result = await this._adminRepository.blockUser(userId)
        if(result.modifiedCount){
            return { success: true, message: "User is blocked"};
        } else {
            return { success: false, message: "User blocking failed" };
        }
    }

    async userUnBlock(userId: string){
        const result = await this._adminRepository.unblockUser(userId)
        if(result.modifiedCount){
            return { success: true, message: "User is unblocked"};
        } else {
            return { success: false, message: "User unblocking is failed" };
        }
    }

    async isVerified( trainerId: string,isVerified: string ){
        const result = await this._adminRepository.isVerified(trainerId, isVerified)
        if(result.modifiedCount){
           if(isVerified === "verified"){
            return { success: true, message: "Trainer is verified"};
           } else {
            return { success: true, message: "Trainer is rejected"};
           }
        } else {
            return { success: false, message: "User unblocking is failed" };
        }
    }

    async fetchTrainers(page:number){
        try {
            const result = await this._adminRepository.fetchTrainers(page)
            return result
        } catch (error) {
            throw error;
        }
    }

    async fetchUsers(page:number){
        try {
            const result = await this._adminRepository.fetchUsers(page)
            return result
        } catch (error) {
            throw error;
        }
    }
}