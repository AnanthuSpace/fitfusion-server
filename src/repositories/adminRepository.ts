import { trainerModel } from "../models/trainerModel";
import { userModel } from "../models/userModel";
import { UserType, TrainerType } from "../types";

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

    async isVerified(trainerId: string, isVerified: string) {
        return trainerModel.updateOne(
            { trainerId: trainerId },
            { $set: { verified: isVerified } }
        )
    }

    async fetchTrainers(page: number) {
        return await trainerModel.find()
            .skip((page - 1) * 5)
            .limit(Number(5))
            .select('-_id');
    }

    async fetchUsers(page: number) {
        return await userModel.find()
            .skip((page - 1) * 5)
            .limit(Number(5))
            .select('-_id');
    }
}