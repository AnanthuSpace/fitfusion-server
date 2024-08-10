import { trainerModel, TrainerType } from "../models/trainerModel";
import { userModel, UserType } from "../models/userModel";

export class AdminRepository {

    async findAllUsers(): Promise<UserType[]> {
        return userModel.find()
    }


    async findAllTrainers(): Promise<TrainerType[]> {
        return trainerModel.find()
    }
}