import { Document } from "mongoose";

// UserType extending Document for Mongoose compatibility
export interface UserType extends Document {
    userId: string;
    name: string;
    email: string;
    phone?: string;
    gender?: string;
    weight?: string;
    heigth?: string;
    activityLevel?: string;
    dietary?: string;
    goals?: string;
    medicalDetails?: string;
    password: string;
    isBlocked: boolean;
    profileIMG?: string;
    address?: string;
    createdAt: Date;
    followed?: string[];
    subscribeList?: string[];
    alreadychattedTrainers?: string[];
    isActive: boolean;
    transactionHistory: TransactionHistory[];
}

// TrainerType extending Document for Mongoose compatibility
export interface TrainerType extends Document {
    trainerId: string;
    name: string;
    email: string;
    phone?: string;
    password: string;
    gender?: string;
    rating: number;
    followers?: string[];
    isBlocked: boolean;
    level: number;
    qualification?: string;
    createdAt: Date;
    profileIMG?: string;
    address?: string;
    achivements?: string;
    verified: string;
    feePerMonth?: string;
    experience?: string;
    subscribedUsers?: string[];
    alreadychattedUsers?: string[];
    isActive: boolean;
    transactionHistory?: TrainerHistory[];
    wallet: number;
}

// ReviewType extending Document for Mongoose compatibility
export interface ReviewType extends Document {
    trainerId: string;
    review: FullReviewType[];
}

export interface FullReviewType {
    userName: string;
    rating: number;
    feedback: number;
    createdAt: Date;
}

export interface TransactionHistory {
    trainerId: string;
    trainerName: string;
    amount: number;
    createdAt?: Date;
}

export interface TrainerHistory {
    userId: string;
    userName: string;
    amount: number;
    createdAt?: Date;
}
