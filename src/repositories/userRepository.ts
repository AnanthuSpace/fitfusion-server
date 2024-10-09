import { FullReviewType, ReviewType, TrainerType, TransactionHistory, UserType } from "../interfaces/common/types";
import { EditUserInterface, ITutorialVideo } from "../interfaces/common/Interfaces";
import { IUserRepository } from "../interfaces/userRepository.interface";
import { IDietPlan } from "../interfaces/common/Interfaces";
import { Model } from "mongoose";

export class UserRepository implements IUserRepository {
    private _userModel: Model<UserType>
    private _trainerModel: Model<TrainerType>
    private _dietPlan: Model<IDietPlan>
    private _reviewModel: Model<ReviewType>
    private _tutorialVideoModel: Model<ITutorialVideo>

    constructor(userModel: Model<UserType>, trainerModel: Model<TrainerType>, dietPlan: Model<IDietPlan>, reviewModel: Model<ReviewType>, TutorialVideoModal: Model<ITutorialVideo>) {
        this._userModel = userModel
        this._trainerModel = trainerModel
        this._dietPlan = dietPlan
        this._reviewModel = reviewModel
        this._tutorialVideoModel = TutorialVideoModal
    }

    async findUser(email: string): Promise<UserType | null> {
        return await this._userModel.findOne({ email: email }, { _id: 0, password: 0 }).lean();
    }    

    async fetchUser(userId: string): Promise<UserType | null> {
        return await this._userModel.findOne({ userId: userId }, { _id: 0 }).lean()
    }

    async registerUser(userData: UserType): Promise<UserType> {
        return await this._userModel.create(userData)
    }

    async activeUser(email: string): Promise<any> {
        return await this._userModel.updateOne({ email: email }, { $set: { isActive: true } })
    }

    async inactiveUser(userId: string): Promise<any> {
        return await this._userModel.updateOne({ userId: userId }, { $set: { isActive: false } })
    }

    async editUser(editUserData: EditUserInterface, userId: string): Promise<any> {
        return await this._userModel.updateOne({ userId }, { $set: editUserData })
    }

    async addUserDetails(userId: string, userDetails: UserType): Promise<any> {
        return await this._userModel.updateOne({ userId }, { $set: userDetails })
    }

    async changePass(newPassword: string, userId: string): Promise<any> {
        const res = await this._userModel.updateOne(
            { userId: userId },
            { $set: { password: newPassword } }
        );
        return res
    }


    async findEditingData(userId: string) : Promise<UserType | null>{
        return await this._userModel.findOne({ userId: userId }, { _id: 0 })
    }


    async blockUser(userId: string): Promise<any> {
        return await this._userModel.updateOne({ userId }, { $set: { isBlocked: true } })
    }

    async fetchTrainers(): Promise<TrainerType[]> {
        return await this._trainerModel.find({ verified: 'verified', }, { _id: 0, password: 0 }).lean()
    }

    async updateUserAfterPayment(userId: string, trainerId: string, trainerName: string, amount: number): Promise<any> {
        await this._userModel.findOneAndUpdate(
            { userId: userId },
            {
                $push: {
                    subscribeList: trainerId,
                    transactionHistory: {
                        trainerId: trainerId,
                        trainerName: trainerName,
                        amount: amount,
                    }
                }
            },
            { new: true }
        );
    }


    async addNewConnectionToAlreadyChattedTrainerListRepository(userId: string, trainerId: string): Promise<any> {
        try {
            return await this._userModel.updateOne(
                { userId: userId },
                { $addToSet: { alreadychattedTrainers: trainerId } }
            );
        } catch (error: any) {
            throw new Error(`Error adding connection: ${error.message}`);
        }
    }

    async fetchAlreadyChattedTrainer(alreadyChatted: string[]): Promise<TrainerType[]> {
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

    async fetchDeitPlans(trainerId: string): Promise<any[]> {
        try {
            const dietPlans = await this._dietPlan.find({ trainerId: trainerId }, { _id: 0 });
            return dietPlans;
        } catch (error: any) {
            throw new Error(`Error fetching diet plan: ${error.message}`);
        }
    }

    registerThroghGoogle(userId: string, name: string, email: string, password: string): Promise<any> {
        return this._userModel.create({
            userId,
            name,
            email,
            password,
        })
    }

    async fetchTrainerScroll(page: number): Promise<any> {
        try {
            return await this._trainerModel.find()
                .skip((page - 1) * 8)
                .limit(Number(8))
                .select('-_id').lean()
        } catch (error: any) {
            throw new Error(`Error fetching diet plan: ${error.message}`);
        }
    }

    async addReview(reviewData: FullReviewType, trainerId: string): Promise<any> {
        try {
            const existingReview = await this._reviewModel.findOne({ trainerId: trainerId });
            
            if (existingReview) {
                const updatedReview = await this._reviewModel.updateOne(
                    { trainerId: trainerId },
                    { $push: { review: reviewData } }
                );
                return updatedReview;
            } else {
                const review = await this._reviewModel.create({
                    trainerId: trainerId,
                    review: [reviewData],
                });
                return review;
            }
        } catch (error: any) {
            throw new Error(`Error adding review: ${error.message}`);
        }
    }
    

    async fetchReview(trainerId: string): Promise<any> {
        try {
            return await this._reviewModel.findOne({ trainerId: trainerId }, { _id: 0 });
        } catch (error: any) {
            throw new Error(`Error adding review: ${error.message}`);
        }
    }

    async fetchSingleTrainer(trainerId: string): Promise<any> {
        try {
            return await this._trainerModel.findOne({ trainerId: trainerId }, {_id:0}).lean()
        } catch (error: any) {
            throw new Error(`Error adding review: ${error.message}`);
        }
    }

    async fetchVideos(trainerId: string): Promise<any> {
        try {
            return await this._tutorialVideoModel.findOne({ trainerId: trainerId }, { _id: 0, videos: 1 }).lean()
        } catch (error: any) {
            throw new Error(`Error adding review: ${error.message}`);
        }
    }

    async fetchAllVideos(trainerIds: string[]): Promise<any> {
        try {
            return await this._tutorialVideoModel.find({ trainerId: { $in: trainerIds } }, { _id: 0 })
        } catch (error: any) {
            throw new Error(`Error adding review: ${error.message}`);
        }
    }

    async getTransactionHostory(userId: string): Promise<TransactionHistory[] | any> {
        try {
            return await this._userModel.findOne({userId: userId},{transactionHistory:1, _id:0})
        } catch (error: any) {
            throw new Error(`Error adding review: ${error.message}`);
        }
    }
}