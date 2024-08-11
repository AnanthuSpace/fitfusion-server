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
}

interface CustomRequest extends Request {
    id?: string;
    email?: string;
}

export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, accessTokenSecret, { expiresIn: accessTokenExpire });
}

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, refreshTokenSecret, { expiresIn: refreshTokenExpire });
}

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const verificationHeader = req.headers.authorization;
    if (!verificationHeader) {
        return res.status(401).json({ message: 'Access denied. Access token not valid' });
    }

    const accessToken = verificationHeader.split(' ')[1];
    if (!accessToken) {
        return res.status(401).json({ message: 'Access denied. Access token not valid' });
    }

    jwt.verify(accessToken, accessTokenSecret, (err, decoded) => {
        if (err) {
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
        if (err) {
            console.log('JWT Verify Error:', err);
            return res.status(401).json({ message: 'Access denied. Access token not valid' });
        } else {
            req.email = (decoded as JwtPayload).email;
            next();
        }
    });
};
