import { FullReviewType, ReviewType, TrainerType, UserType } from "../interfaces/common/types";
import { EditUserInterface } from "../interfaces/common/Interfaces";
import { IUserRepository } from "../interfaces/userRepository.interface";
import { Model } from "mongoose";
import { IDietPlan } from "../interfaces/common/Interfaces";

export class UserRepository implements IUserRepository {
    private _userModel: Model<UserType>
    private _trainerModel: Model<TrainerType>
    private _dietPlan: Model<IDietPlan>
    private _reviewModel: Model<ReviewType>

    constructor(userModel: Model<UserType>, trainerModel: Model<TrainerType>, dietPlan: Model<IDietPlan>, reviewModel: Model<ReviewType>) {
        this._userModel = userModel
        this._trainerModel = trainerModel
        this._dietPlan = dietPlan
        this._reviewModel = reviewModel
    }

    async findUser(email: string) {
        return await this._userModel.findOne({ email: email }, { _id: 0, password: 0 })
    }

    async fetchUser(userId: string) {
        return await this._userModel.findOne({ userId: userId }, { _id: 0 })
    }

    async registerUser(userData: UserType) {
        return await this._userModel.create(userData)
    }

    async activeUser(email: string) {
        return await this._userModel.updateOne({ email: email }, { $set: { isActive: true } })
    }

    async inactiveUser(userId: string) {
        return await this._userModel.updateOne({ userId: userId }, { $set: { isActive: false } })
    }

    async editUser(editUserData: EditUserInterface, userId: string) {
        return await this._userModel.updateOne({ userId }, { $set: editUserData })
    }

    async addUserDetails(userId: string, userDetails: UserType) {
        return await this._userModel.updateOne({ userId }, { $set: userDetails })
    }

    async changePass(newPassword: string, userId: string) {
        const res = await this._userModel.updateOne(
            { userId: userId },
            { $set: { password: newPassword } }
        );
        return res
    }


    async findEditingData(userId: string) {
        return await this._userModel.findOne({ userId: userId }, { _id: 0 })
    }


    async blockUser(userId: string) {
        return await this._userModel.updateOne({ userId }, { $set: { isBlocked: true } })
    }

    async fetchTrainers() {
        return await this._trainerModel.find({ verified: 'verified', }, { _id: 0, password: 0 }).lean()
    }

    async updateUserAfterPayment(userId: string, trainerId: string): Promise<void> {
        await this._userModel.findOneAndUpdate(
            { userId: userId },
            { $push: { subscribeList: trainerId } }
        );
    }


    async addNewConnectionToAlreadyChattedTrainerListRepository(userId: string, trainerId: string) {
        try {
            return await this._userModel.updateOne(
                { userId: userId },
                { $addToSet: { alreadychattedTrainers: trainerId } }
            );
        } catch (error: any) {
            throw new Error(`Error adding connection: ${error.message}`);
        }
    }

    async fetchAlreadyChattedTrainer(alreadyChatted: string[]) {
        try {
            const trainers = await this._trainerModel.find(
                { trainerId: { $in: alreadyChatted } },
                { _id: 0, name: 1, trainerId: 1 }
            );
            return trainers
        } catch (error: any) {
            throw new Error(`Error adding connection: ${error.message}`);
        }
    }

    async fetchDeitPlans(trainerId: string) {
        try {
            const dietPlans = await this._dietPlan.find({ trainerId: trainerId }, { _id: 0 });
            return dietPlans;
        } catch (error: any) {
            throw new Error(`Error fetching diet plan: ${error.message}`);
        }
    }

    async fetchTrainerScroll(page: number) {
        try {
            return await this._trainerModel.find()
                .skip((page - 1) * 8)
                .limit(Number(8))
                .select('-_id').lean()
        } catch (error: any) {
            throw new Error(`Error fetching diet plan: ${error.message}`);
        }
    }

    async addReview(reviewData: FullReviewType, trainerId: string) {
        try {
            const existingReview = await this._reviewModel.findOne({ trainerId: trainerId });
            if (existingReview) {
                const updatedReview = await this._reviewModel.updateOne(
                    { trainerId: trainerId },
                    { $push: { review: reviewData } }
                );
                return updatedReview;
            } else {
                const fullReview: ReviewType = {
                    trainerId: trainerId,
                    review: [reviewData]
                };
                const review = await this._reviewModel.create(fullReview);
                return review;
            }
        } catch (error: any) {
            throw new Error(`Error adding review: ${error.message}`);
        }
    }

    async fetchReview(trainerId: string) {
        try {
            return await this._reviewModel.findOne({ trainerId: trainerId }, { _id: 0 });
        } catch (error: any) {
            throw new Error(`Error adding review: ${error.message}`);
        }
    }

    async fetchSingleTrainer(trainerId: string) {
        try {
            return await this._trainerModel.findOne({ trainerId: trainerId })
        } catch (error: any) {
            throw new Error(`Error adding review: ${error.message}`);
        }
    }
}