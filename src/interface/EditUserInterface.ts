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
}