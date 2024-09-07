import { UserType, TrainerType } from "../interfaces/common/types";
import { IAdminRepository } from "../interfaces/adminRepository.interface";
import { Model } from "mongoose";

export class AdminRepository implements IAdminRepository {
private _trainerModel: Model<TrainerType>
private _userModel: Model<UserType>

constructor(trainerModel: Model<TrainerType>, userModel: Model<UserType>){
    this._trainerModel = trainerModel
    this._userModel = userModel
}

    async findAllUsers(): Promise<UserType[]> {
        return this._userModel.find({}, { _id: 0, password: 0 });
    }

    async findAllTrainers(): Promise<TrainerType[]> {
        return this._trainerModel.find({}, { _id: 0, password: 0 });
    }

    async blockUser(userId: string): Promise<any> {
        return this._userModel.updateOne(
            { userId: userId },
            { $set: { isBlocked: true } }
        );
    }

    async unblockUser(userId: string): Promise<any> {
        return this._userModel.updateOne(
            { userId: userId },
            { $set: { isBlocked: false } }
        );
    }

    async blockTrainer(trainerId: string): Promise<any> {
        return this._trainerModel.updateOne(
            { trainerId: trainerId },
            { $set: { isBlocked: true } }
        );
    }

    async unblockTrainer(trainerId: string): Promise<any> {
        return this._trainerModel.updateOne(
            { trainerId: trainerId },
            { $set: { isBlocked: false } }
        );
    }

    async isVerified(trainerId: string, isVerified: string): Promise<any> {
        return this._trainerModel.updateOne(
            { trainerId: trainerId },
            { $set: { verified: isVerified } }
        );
    }

    async fetchTrainers(page: number): Promise<TrainerType[]> {
        return this._trainerModel.find()
            .skip((page - 1) * 5)
            .limit(Number(5))
            .select('-_id');
    }

    async fetchUsers(page: number): Promise<UserType[]> {
        return this._userModel.find()
            .skip((page - 1) * 5)
            .limit(Number(5))
            .select('-_id');
    }
}