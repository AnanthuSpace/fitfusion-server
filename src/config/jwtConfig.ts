import jwt from "jsonwebtoken"
import dontenv from "dotenv"

dontenv.config()

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;
const accessTokenExpire = process.env.ACCESS_TOKEN_EXPIRATION!;
const refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRATION!;

interface JwtPayload {
    userId: string
}

export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, accessTokenSecret, { expiresIn: accessTokenExpire });
}


export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, refreshTokenSecret, { expiresIn: refreshTokenExpire });
}


export const verifyAccessToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, accessTokenSecret) as JwtPayload;
    } catch (err) {
        console.error('Access Token verification failed:', err);
        return null;
    }
}

export const verifyRefreshToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, refreshTokenSecret) as JwtPayload;
    } catch (err) {
        console.error('Refresh Token verification failed:', err);
        return null;
    }
}