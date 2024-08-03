import { UserType, userModel } from "../models/userModel";
import { EditUserInterface } from "../interface/EditUserInterface";

export class UserRepository {

    async findUser(email: string) {
        return await userModel.findOne({ email: email })
    }

    async registerUser(userData: UserType){
        return await userModel.create(userData)
    }

    async editUser(editUserData: EditUserInterface, userId: string){
        console.log("EditRepo");
        
        return await userModel.updateOne({userId}, {$set: editUserData})
    }

    async changePass(newPassword: string, userId:string){
        return await userModel.updateOne({userId},{$set: {password: newPassword}})
    }

    async findEditingData(userId:string) {
        return await userModel.findOne({ userId: userId })
    }
}