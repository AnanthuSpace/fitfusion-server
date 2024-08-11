import { trainerModel, TrainerType } from "../models/trainerModel";
import { userModel, UserType } from "../models/userModel";

export class AdminRepository {

    async findAllUsers(): Promise<UserType[]> {
        return userModel.find({}, { _id: 0, password: 0 })
    }


    async findAllTrainers(): Promise<TrainerType[]> {
        return trainerModel.find({}, { _id: 0, password: 0 })
    }

    async blockUser(userId: string) {
        return userModel.updateOne(
            { userId: userId },
            { $set: { isBlocked: true } },
        );
    }


    async unblockUser(userId: string) {
        return userModel.updateOne(
            { userId: userId },
            { $set: { isBlocked: false } },
        );
    }


    async blockTrainer(trainerId: string) {
        return trainerModel.updateOne(
            { trainerId: trainerId },
            { $set: { isBlocked: true } },
        );
    }


    async unblockTrainer(trainerId: string) {
        return trainerModel.updateOne(
            { trainerId: trainerId },
            { $set: { isBlocked: false } },
        );
    }
}