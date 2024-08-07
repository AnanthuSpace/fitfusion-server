import { Schema, model, Document } from "mongoose";


type UserType = {
    userId: string;
    name: string;
    email: string;
    phone?: string;
    gender?: string;
    password: string;
    isBlocked: boolean;
    profileIMG?: string;
    address?: string;
    createdAt: Date;
    followed?: string[];
};



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
    }]
});


const userModel = model<UserType>("User", userSchema);


export { userModel, UserType };
