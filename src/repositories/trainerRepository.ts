import { TrainerType, trainerModel } from "../models/trainerModel";
import { EditTrainerInterface, IDietPlan } from "../Interfaces";
import { userModel } from "../models/userModel";
import DietPlan from "../models/dietModal";

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

    async addNewConnectionToAlreadyChattedTrainerListRepository(trainerId: string, userId: string) {
        try {
            return await trainerModel.updateOne(
                { trainerId: trainerId },
                { $addToSet: { alreadychattedUsers: userId } }
            );
        } catch (error: any) {
            throw new Error(`Error adding connection: ${error.message}`);
        }
    }

    async fetchCustomer(userIds: string[]) {
        try {

            return await userModel.find({ userId: { $in: userIds } }, { _id: 0, password: 0, isBlocked: 0, followed: 0, subscribeList: 0, alreadychattedTrainers: 0 })
        } catch (error: any) {
            throw new Error(`Error adding connection: ${error.message}`);
        }
    }

    async fetchDeitPlans(trainerId: string) {
        try {
         const dietPlans = await DietPlan.find({ trainerId: trainerId }, {_id:0}).lean()
         return dietPlans
        } catch (error: any) {
            throw new Error(`Error adding connection: ${error.message}`);
        }
    }

    async AddDietPlan(dietPlan: IDietPlan) {
        try {
            const newDietPlan = new DietPlan({ ...dietPlan });
            const savedDietPlan = await newDietPlan.save();
            return savedDietPlan;
        } catch (error: any) {
            throw new Error(`Error adding connection: ${error.message}`);
        }
    }

    async existedDiet(trainerId: string, dietName: string): Promise<boolean> {
        try {
            const diet = await DietPlan.findOne({ trainerId, dietName });
            return !!diet;
        } catch (error: any) {
            throw new Error(`Error checking diet existence: ${error.message}`);
        }
    }

}