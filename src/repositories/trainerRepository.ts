import { TrainerType, trainerModel } from "../models/trainerModel";

export class TrainerRepository {

    async findTrainerInRegister(email: string): Promise<TrainerType | null> {
        return trainerModel.findOne({ email }, {_id:0}).lean();
    }
    

    async registerTrainer( trainerData: TrainerType){
        return await trainerModel.create(trainerData)
    }
}