import { generateAccessToken, generateRefreshToken } from "../config/jwtConfig";
import { AdminRepository } from "../repositories/adminRepository";

export class AdminService {
    private adminRepository = new  AdminRepository();

    

    async adminLoginService(username: string, password: string) {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;


        if (username === adminUsername && password === adminPassword) {
            const accessToken = generateAccessToken(username);
            const refreshToken = generateRefreshToken(username);
            const usersData = await this.adminRepository.findAllUsers()
            const trainersData = await this.adminRepository.findAllTrainers()
            return { success: true, message: "Login successful", accessToken, refreshToken, usersData, trainersData };
        } else {
            return { success: false, message: "Invalid Username and password" };
        }
    }

    async trainerBlock(trainerId: string){
        const result = await this.adminRepository.blockTrainer(trainerId)
        if(result.modifiedCount){
            return { success: true, message: "Trainer is blocked"};
        } else {
            return { success: false, message: "Trainer blocking failed" };
        }
    }
    async trainerUnBlock(trainerId: string){
        const result = await this.adminRepository.unblockTrainer(trainerId)
        if(result.modifiedCount){
            return { success: true, message: "Trainer is unblocked"};
        } else {
            return { success: false, message: "Trainer unblocking is failed" };
        }
    }

    async userBlock(userId: string){
        const result = await this.adminRepository.blockUser(userId)
        if(result.modifiedCount){
            return { success: true, message: "User is blocked"};
        } else {
            return { success: false, message: "User blocking failed" };
        }
    }
    async userUnBlock(userId: string){
        const result = await this.adminRepository.unblockUser(userId)
        if(result.modifiedCount){
            return { success: true, message: "User is unblocked"};
        } else {
            return { success: false, message: "User unblocking is failed" };
        }
    }

    async isVerified( trainerId: string,isVerified: string ){
        const result = await this.adminRepository.isVerified(trainerId, isVerified)
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
}