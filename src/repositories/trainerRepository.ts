import { TrainerType, trainerModel } from "../models/trainerModel";

export class TrainerRepository {

    async findTrainerInRegister(email: string) {
        return await trainerModel.findOne({email: email})
    }

    async registerTrainer( trainerData: TrainerType){
        return await trainerModel.create(trainerData)
    }
}