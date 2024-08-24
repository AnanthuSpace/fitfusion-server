import { UserType, userModel } from "../models/userModel";
import { EditUserInterface } from "../interface/EditUserInterface";
import { trainerModel } from "../models/trainerModel";

export class UserRepository {

    async findUser(email: string) {
        return await userModel.findOne({ email: email }, { _id: 0 })
    }

    async registerUser(userData: UserType) {
        return await userModel.create(userData)
    }

    async editUser(editUserData: EditUserInterface, userId: string) {
        return await userModel.updateOne({ userId }, { $set: editUserData })
    }

    async addUserDetails(userId: string, userDetails: UserType){
        return await userModel.updateOne({userId}, {$set: userDetails})
    }

    async changePass(newPassword: string, userId: string) {
        const res = await userModel.updateOne(
            { userId: userId },
            { $set: { password: newPassword } }
        );
        return res
    }


    async findEditingData(userId: string) {
        return await userModel.findOne({ userId: userId }, { _id: 0 })
    }


    async blockUser(userId: string) {
        return await userModel.updateOne({ userId }, { $set: { isBlocked: true } })
    }

    async fetchTrainers() {
        return await trainerModel.find({ verified: 'verified', }, { _id: 0, password: 0 })
    }

    async updateUserAfterPayment(userId: string, trainerId: string): Promise<void> {
        await userModel.findOneAndUpdate(
            { userId: userId }, 
            { $push: { subscribeList: trainerId } }
        );
    } 
}