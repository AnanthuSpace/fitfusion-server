import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;
const accessTokenExpire = process.env.ACCESS_TOKEN_EXPIRATION!;
const refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRATION!;

interface JwtPayload {
    userId: string;
    email?: string;
    role?: string;
}

interface CustomRequest extends Request {
    id?: string;
    email?: string;
}

export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, accessTokenSecret, { expiresIn: accessTokenExpire });
}

export const generateAccessTokenForAdmin = (username: string): string => {
    return jwt.sign({ username, role: 'admin' }, accessTokenSecret, { expiresIn: accessTokenExpire });
}

export const generateRefreshTokenForAdmin = (username: string): string => {
    return jwt.sign({ username, role: 'admin' }, refreshTokenSecret, { expiresIn: refreshTokenExpire });
}

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, refreshTokenSecret, { expiresIn: refreshTokenExpire });
}

export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const verificationHeader = req.headers.authorization;
    const refreshToken = req.headers['x-refresh-token'] as string;

    if (!verificationHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided' });
    }

    const accessToken = verificationHeader.split(' ')[1];
    if (!accessToken) {
        return res.status(401).json({ message: 'Access denied. Access token not valid' });
    }

    jwt.verify(accessToken, accessTokenSecret, async (err, decoded) => {
        if (err && err.name === 'TokenExpiredError') {
            if (!refreshToken) {
                return res.status(401).json({ message: 'Access denied. Refresh token not provided' });
            }
            jwt.verify(refreshToken, refreshTokenSecret, (refreshErr, refreshDecoded) => {
                if (refreshErr) {
                    return res.status(401).json({ message: 'Access denied. Refresh token invalid or expired' });
                }
                const userId = (refreshDecoded as JwtPayload).userId;
                const newAccessToken = jwt.sign({ userId }, accessTokenSecret, { expiresIn: accessTokenExpire });
                res.setHeader('Authorization', `Bearer ${newAccessToken}`);
                req.id = userId;
                next();
            });
        } else if (err) {
            return res.status(401).json({ message: 'Access denied. Access token not valid' });
        } else {
            req.id = (decoded as JwtPayload).userId;
            next();
        }
    });
};

export const adminVerification = (req: CustomRequest, res: Response, next: NextFunction) => {
    const verificationHeader = req.headers.authorization;

    if (!verificationHeader) {
        return res.status(401).json({ message: 'Access denied. Access token not valid' });
    }

    const accessToken = verificationHeader.split(' ')[1];

    if (!accessToken) {
        return res.status(401).json({ message: 'Access denied. Access token not valid' });
    }

    jwt.verify(accessToken, accessTokenSecret, { algorithms: ['HS256'] }, (err, decoded) => {
        if (err && err.name === 'TokenExpiredError') {
            const refreshToken = req.headers['x-refresh-token'] as string;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Access denied. Refresh token not provided' });
            }

            jwt.verify(refreshToken, refreshTokenSecret, async (refreshErr, refreshDecoded) => {
                if (refreshErr) {
                    return res.status(401).json({ message: 'Access denied. Refresh token invalid or expired' });
                }

                const newAccessToken = generateAccessTokenForAdmin((refreshDecoded as JwtPayload).userId);
                res.setHeader('Authorization', `Bearer ${newAccessToken}`);

                if ((refreshDecoded as JwtPayload).role !== 'admin') {
                    return res.status(403).json({ message: 'Access denied. Insufficient permissions' });
                }

                req.email = (refreshDecoded as JwtPayload).email;
                next();
            });
        } else if (err) {
            console.log('JWT Verify Error:', err);
            return res.status(401).json({ message: 'Access denied. Access token not valid' });
        } else {
            req.email = (decoded as JwtPayload).email;
            next();
        }
    });
};
