import mongoose from "mongoose";


export const dbConnection = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.HOST as string)
        console.log(`Database Connected`);
    } catch (error) {
        console.log("Database is not connected", error);
    }
}