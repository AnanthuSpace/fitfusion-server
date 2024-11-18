import { Schema, model } from "mongoose";
import { TrainerType } from "../interfaces/common/types";

const transactionSchema = new Schema({
    userId: String,
    userName: String,
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
    rating: {
        type: Number,
        default: 0
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
    experience: {
        type: String
    },
    subscribedUsers: [{
        type: String,
        unique: true
    }],
    alreadychattedUsers: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: false
    },
    transactionHistory: [transactionSchema],
    wallet: {
        type: Number,
        default: 0
    }
})


const trainerModel = model<TrainerType>("Trainer", trainerSchema)

export { trainerModel };