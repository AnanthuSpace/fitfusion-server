import { Schema, model } from "mongoose";
import { UserType } from "../types";

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
    weight : {
        type: String
    },
    heigth : {
        type: String
    },
    activityLevel : {
        type: String
    },
    dietary : {
        type: String
    },
    goals : {
        type: String
    },
    medicalDetails : {
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
    followed: [{
        type: String
    }],
    subscribeList: [{
        type: String
    }],
    alreadychattedTrainers: [{
        type: String
    }]
});


const userModel = model<UserType>("User", userSchema);
export { userModel };
