export type UserType = {
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
};

export type TrainerType = {
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
    qualification?: string
    createdAt: Date;
    profileIMG?: string,
    address?: string,
    achivements?: string,
    verified: string,
    feePerMonth?: string,
    payedUsers?: string[],
    experience?: string,
    subscribedUsers?: string[],
    alreadychattedUsers?: string[]
}

export type ReviewType = {
    trainerId: string,
    review: FullReviewType[],
}

export type FullReviewType = {
    userName: string,
    rating: number,
    feedback: number,
}