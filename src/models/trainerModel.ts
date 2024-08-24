import { Schema, model } from "mongoose";

type TrainerType = {
    trainerId: string;
    name: string;
    email: string;
    phone?: string;
    password: string;
    gender?: string;
    rating?: number;
    followers?: string[];
    isBlocked: boolean;
    level: number;
    qualification?: string
    createdAt: Date;
    profileIMG?: string,
    address?: string,
    achivements?: string,
    verified: string,
    feePerMonth?: string,
    payedUsers?: string[],
    experience?: string,
    subscribedUsers?: string[]
}


const trainerSchema = new Schema<TrainerType>({
    trainerId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    gender: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    profileIMG: {
        type: String
    },
    address: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    followers: [{
        type: String
    }],
    rating: {
        type: Number
    },
    level: {
        type: Number,
        default: 3
    },
    achivements: {
        type: String
    },
    qualification: {
        type: String
    },
    verified: {
        type: String,
        default: "pending",
    },
    feePerMonth: {
        type: String,
    },
    payedUsers: [{
        type: String,
    }],
    experience: {
        type: String
    },
    subscribedUsers: [{
        type: String,
        unique: true
    }],
})


const trainerModel = model<TrainerType>("Trainer", trainerSchema)

export { trainerModel, TrainerType };