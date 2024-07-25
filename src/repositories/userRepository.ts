import { UserType, userModel } from "../models/userModel";

export class UserRepository {

    async findUser(email: string) {
        return await userModel.findOne({ email: email })
    }

    async registerUser(userData: UserType){
        return await userModel.create(userData)
    }
}