import Stripe from "stripe";

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
    userData: any;
    trainerData: any;
}

export interface MessageType {
    chatMembers: string[];
    details: {
        senderID: string;
        receiverID: string;
        messages: string;
        time?: Date;
    }[];
}

export interface MessageDetailType {
    senderID: string;
    receiverID: string;
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

