import Stripe from "stripe";
import { Document } from "mongoose";
import { UpdateResult } from "mongodb";

export interface EditUserInterface {
    name: string;
    phone: string;
    address: string;
    gender: string;
    password: string;
    weight: string;
    heigth: string;
    activityLevel: string;
    dietary: string;
    goals: string;
    medicalDetails?: string;
}

export interface EditTrainerInterface {
    name: string;
    phone: string;
    gender: string;
    address: string;
    qualification: string;
    achivements: string;
    feePerMonth: string;
    experience: string;
}

export interface PaymentSessionResponse {
    session: Stripe.Checkout.Session;
    // userData: any;
    // trainerData: any;
}

export interface MessageType {
    chatMembers: string[];
    details: {
        senderId: string;
        receiverId: string;
        messages: string;
        time?: Date;
    }[];
}

export interface MessageDetailType {
    senderId: string;
    receiverId: string;
    messages: string;
    time?: Date;
}

export interface IMeal {
    mealTime: string;
    items: string[];
}

export interface IDietPlan {
    trainerId: string;
    dietName: string;
    description: string;
    meals?: IMeal[];
}

export interface IChat extends Document {
    chatMembers?: string[];
    details: {
        senderId: string;
        receiverId: string;
        messages: string;
        time?: Date;
    }[];
    createdAt: Date;
}

export interface ITutorialVideo {
    trainerId: string; 
    videos: {
        videoId: string;
        videoUrl: string; 
        title: string;
        thumbnail: string;
        description?: string;
        category?: string;
        uploadDate?: Date; 
        listed: boolean;
    }[];
}

export interface ProfileUpdateResult {
    url: string;
    result: UpdateResult;
}

export interface ITransaction {
    userId: string;
    trainerId: string;
    amount: number;
    status: string,
    createdAt: Date;
    expiredAt: Date;
}