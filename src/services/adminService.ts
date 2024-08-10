import { generateAccessToken, generateRefreshToken } from "../config/jwtConfig";
import { AdminRepository } from "../repositories/adminRepository";

export class AdminService {
    private adminRepository: AdminRepository;

    constructor(adminRepository: AdminRepository) {
        this.adminRepository = adminRepository;
    }

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
}