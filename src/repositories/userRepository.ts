import { UserType, userModel } from "../models/userModel";
import { EditUserInterface } from "../interface/EditUserInterface";

export class UserRepository {

    async findUser(email: string) {
        return await userModel.findOne({ email: email }, {_id:0})
    }

    async registerUser(userData: UserType){
        return await userModel.create(userData)
    }

    async editUser(editUserData: EditUserInterface, userId: string){
        return await userModel.updateOne({userId}, {$set: editUserData})
    }

    async changePass(newPassword: string, userId: string) {
        const res =  await userModel.updateOne(
            { userId: userId },
            { $set: { password: newPassword } }
        );
        return res
    }
    

    async findEditingData(userId:string) {
        return await userModel.findOne({ userId: userId }, {_id:0})
    }


    async blockUser(userId: string){
        return await userModel.updateOne({userId}, {$set: {isBlocked:true}})
    }
}