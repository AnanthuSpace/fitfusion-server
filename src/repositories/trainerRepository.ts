import { TrainerType, trainerModel } from "../models/trainerModel";
import { EditTrainerInterface } from "../interface/EditUserInterface";

export class TrainerRepository {

    async findTrainerInRegister(email: string): Promise<TrainerType | null> {
        return trainerModel.findOne({ email }, { _id: 0 }).lean();
    }


    async registerTrainer(trainerData: TrainerType) {
        return await trainerModel.create(trainerData)
    }


    async editTrainer(editTrainerData: EditTrainerInterface, trainerId: string) {
        console.log(editTrainerData.qualification);
        return await trainerModel.updateOne({ trainerId }, { $set: editTrainerData })
    }

    async changePass(newPassword: string, trainerId: string) {
        const res = await trainerModel.updateOne(
            { trainerId: trainerId },
            { $set: { password: newPassword } }
        );
        return res
    }

    async findEditingData(trainerId: string) {
        return await trainerModel.findOne({ trainerId: trainerId }, { _id: 0 })
    }
    async profileUpdate(trainerId: string, profileImage: string) {
        return await trainerModel.updateOne(
            { trainerId: trainerId },
            { $set: { profileIMG: profileImage } }
        );
    }

    async updateTrainerSubscription(trainerId: string, userId: string): Promise<void> {
        await trainerModel.findOneAndUpdate(
            { trainerId: trainerId }, 
            { $push: { subscribedUsers: userId } }
        );
    }
    
}