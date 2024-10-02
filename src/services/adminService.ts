import { generateAccessTokenForAdmin, generateRefreshToken } from "../config/jwtConfig";
import { IAdminService } from "../interfaces/adminService.interface";
import { IAdminRepository } from "../interfaces/adminRepository.interface";
import { getObjectURL } from "../config/awsConfig";
import { sendMail } from "../config/nodeMailer";

export class AdminService implements IAdminService {
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

    async trainerBlock(trainerId: string) {
        const result = await this._adminRepository.blockTrainer(trainerId)
        if (result.modifiedCount) {
            return { success: true, message: "Trainer is blocked" };
        } else {
            return { success: false, message: "Trainer blocking failed" };
        }
    }

    async trainerUnBlock(trainerId: string) {
        const result = await this._adminRepository.unblockTrainer(trainerId)
        if (result.modifiedCount) {
            return { success: true, message: "Trainer is unblocked" };
        } else {
            return { success: false, message: "Trainer unblocking is failed" };
        }
    }

    async userBlock(userId: string) {
        const result = await this._adminRepository.blockUser(userId)
        if (result.modifiedCount) {
            return { success: true, message: "User is blocked" };
        } else {
            return { success: false, message: "User blocking failed" };
        }
    }

    async userUnBlock(userId: string) {
        const result = await this._adminRepository.unblockUser(userId)
        if (result.modifiedCount) {
            return { success: true, message: "User is unblocked" };
        } else {
            return { success: false, message: "User unblocking is failed" };
        }
    }

    async isVerified(trainerId: string, isVerified: string, reason?: string): Promise<any> {
        let result;

        try {
            if (isVerified === "rejected") {
                await sendMail(trainerId, "rejection", undefined, reason);

                result = await this._adminRepository.deleteTrainer(trainerId);

                if (result.deletedCount > 0) {
                    return { success: true, message: "Trainer is rejected and deleted successfully" };
                } else {
                    return { success: false, message: "Trainer rejection failed: Trainer not found" };
                }
            } else if (isVerified === "verified") {
                result = await this._adminRepository.isVerified(trainerId, isVerified);
                await sendMail(trainerId, "approval", undefined);
                if (result.modifiedCount > 0) {
                    return { success: true, message: "Trainer is verified" };
                } else {
                    return { success: false, message: "Trainer verification failed" };
                }
            } else {
                return { success: false, message: "Invalid status provided" };
            }
        } catch (error) {
            return { success: false, message: "An error occurred during the process", error };
        }
    }


    async fetchTrainers(page: number) {
        try {
            const result = await this._adminRepository.fetchTrainers(page)
            return result
        } catch (error) {
            throw error;
        }
    }

    async fetchUsers(page: number) {
        try {
            const result = await this._adminRepository.fetchUsers(page)
            return result
        } catch (error) {
            throw error;
        }
    }

    async fetchIndividualTrainer(trainerId: string): Promise<any> {
        try {
            let trainerData = await this._adminRepository.fetchIndividualTrainer(trainerId)
            const url = await getObjectURL(`trainerProfile/${trainerData?.profileIMG}`)
            trainerData = { ...trainerData, profileIMG: url }
            return trainerData
        } catch (error) {
            throw error;
        }
    }

    async fetchDataForDashboard(startDate: Date, endDate: Date): Promise<any> {
        try {
            const result = await this._adminRepository.findUserDatas(startDate, endDate)
            return result
        } catch (error) {
            throw error;
        }
    }

    async fetchNewUsersAndTrainers(): Promise<any> {
        try {
            const result = await this._adminRepository.fetchNewUsersAndTrainers()
            return result
        } catch (error) {
            throw error
        }
    }
}