import { Schema, model } from "mongoose";
import { UserType } from "../interfaces/common/types";


const transactionSchema = new Schema({
    trainerId: String,
    trainerName: String,
    amount: Number,
    status: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiredAt: {
        type: Date,
        default: function () {
            return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        },
    },
});

const userSchema = new Schema<UserType>({
    userId: {
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
    weight: {
        type: String
    },
    heigth: {
        type: String
    },
    activityLevel: {
        type: String
    },
    dietary: {
        type: String
    },
    goals: {
        type: String
    },
    medicalDetails: {
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
    subscribeList: [{
        type: String
    }],
    alreadychattedTrainers: [{
        type: String
    }],
    wallet: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: false
    },
    transactionHistory: [transactionSchema]
});


const userModel = model<UserType>("User", userSchema);
export { userModel };
