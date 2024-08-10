import { Request, Response } from "express";
import { AdminService } from "../services/adminService";
import { generateAccessToken, generateRefreshToken } from "../config/jwtConfig";

const adminService = new AdminService();

export class AdminController {
    async adminLogin(req: Request, res: Response): Promise<any> {
        try {
            const { username, password } = req.body;
            const adminUsername = process.env.ADMIN_USERNAME;
            const adminPassword = process.env.ADMIN_PASSWORD;
            console.log(adminUsername, username);
            
            const accessToken = generateAccessToken(username)
            const refreshToken = generateRefreshToken(username)
            if (username === adminUsername && password === adminPassword) {
                return res.status(200).json({ success: true, message: "Login successful", accessToken, refreshToken });
            } else {
                return res.status(403).json({ success: false, message: "Invalid Username and password" });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}
