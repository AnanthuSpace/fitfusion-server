import { EditTrainerInterface, IDietPlan, ITutorialVideo } from "../interfaces/common/Interfaces";
import { TrainerType, UserType } from "../interfaces/common/types";
import { ITrainerRepository } from "../interfaces/trainerRepository.interface";
import { Model } from "mongoose";

export class TrainerRepository implements ITrainerRepository {
    private _trainerModel: Model<TrainerType>
    private _userModel: Model<UserType>
    private _dietModel: Model<IDietPlan>
    private _tutorialModal: Model<ITutorialVideo>

    constructor(trainerModel: Model<TrainerType>, userModel: Model<UserType>, DietPlan: Model<IDietPlan>, TutorialVideoModal: Model<ITutorialVideo>) {
        this._trainerModel = trainerModel
        this._userModel = userModel
        this._dietModel = DietPlan
        this._tutorialModal = TutorialVideoModal
    }

    async findTrainerInRegister(email: string): Promise<TrainerType | null> {
        return this._trainerModel.findOne({ email }, { _id: 0 }).lean();
    }

    async registerTrainer(trainerData: TrainerType) {
        return await this._trainerModel.create(trainerData)
    }

    async editTrainer(editTrainerData: EditTrainerInterface, trainerId: string) {
        return await this._trainerModel.updateOne({ trainerId }, { $set: editTrainerData })
    }

    registerThroghGoogle(trainerId: string, name: string, email: string, password: string): Promise<any> {
        return this._trainerModel.create({
            trainerId,
            name,
            email,
            password,
        })
    }

    async changePass(newPassword: string, trainerId: string) {
        const res = await this._trainerModel.updateOne(
            { trainerId: trainerId },
            { $set: { password: newPassword } }
        );
        return res
    }

    async findEditingData(trainerId: string) {
        return await this._trainerModel.findOne({ trainerId: trainerId }, { _id: 0 })
    }

    async profileUpdate(trainerId: string, profileImage: string) {
        return await this._trainerModel.updateOne(
            { trainerId: trainerId },
            { $set: { profileIMG: profileImage } }
        );
    }

    async updateTrainerSubscription(trainerId: string, userId: string, userName: string, amount: number): Promise<void> {
        await this._trainerModel.findOneAndUpdate(
            { trainerId: trainerId },
            {
                $push: {
                    subscribedUsers: userId,
                    transactionHistory: {
                        userId: userId,
                        userName: userName,
                        amount: amount
                    }
                },
                $inc: { wallet: amount }
            },
            { new: true }
        );
    }


    async fetchCustomer(userIds: string[]) {
        try {
            return await this._userModel.find({ userId: { $in: userIds } }, { _id: 0, password: 0, isBlocked: 0, followed: 0, subscribeList: 0, alreadychattedTrainers: 0 })
        } catch (error: any) {
            throw new Error(`Error adding connection: ${error.message}`);
        }
    }

    async fetchDeitPlans(trainerId: string) {
        try {
            const dietPlans = await this._dietModel.find({ trainerId: trainerId }, { _id: 0 }).lean()
            return dietPlans
        } catch (error: any) {
            throw new Error(`Error adding connection: ${error.message}`);
        }
    }

    async AddDietPlan(dietPlan: IDietPlan) {
        try {
            const newDietPlan = new this._dietModel({ ...dietPlan });
            const savedDietPlan = await newDietPlan.save();
            return savedDietPlan;
        } catch (error: any) {
            throw new Error(`Error adding connection: ${error.message}`);
        }
    }

    async existedDiet(trainerId: string, dietName: string): Promise<boolean> {
        try {
            const diet = await this._dietModel.findOne({ trainerId, dietName });
            return !!diet;
        } catch (error: any) {
            throw new Error(`Error checking diet existence: ${error.message}`);
        }
    }

    async addNewConnectionToAlreadyChattedTrainerListRepository(trainerId: string, userId: string) {
        try {
            return await this._trainerModel.updateOne(
                { trainerId: trainerId },
                { $addToSet: { alreadychattedUsers: userId } }
            );
        } catch (error: any) {
            throw new Error(`Error adding connection: ${error.message}`);
        }
    }

    async fetchAlreadyChatted(alreadyChatted: string[]) {
        try {
            const users = await this._userModel.find(
                { userId: { $in: alreadyChatted } },
                { _id: 0, name: 1, userId: 1 }
            );
            return users
        } catch (error: any) {
            throw new Error(`Error adding connection: ${error.message}`);
        }
    }

    async ratingUpdate(trainerId: string, updatedAverageRating: number) {
        try {
            const updatedTrainer = await this._trainerModel.updateOne({ trainerId: trainerId }, { $set: { rating: updatedAverageRating } })
            return updatedTrainer
        } catch (error: any) {
            throw new Error(`Error adding connection: ${error.message}`);
        }
    }

    async videoUpload(trainerId: string, videoUploadResult: string, thumbnailUploadResult: string, title: string, description: string, videoId: string): Promise<void> {
        try {
            await this._tutorialModal.updateOne(
                { trainerId: trainerId },
                { $push: { videos: { videoId: videoId, videoUrl: videoUploadResult, thumbnail: thumbnailUploadResult, title: title, description: description } } },
                { upsert: true }
            );
        } catch (error: any) {
            throw new Error(`Error adding/updating trainer video: ${error.message}`);
        }
    }


    async profileFetch(trainerId: string): Promise<any> {
        return await this._trainerModel.findOne({ trainerId: trainerId }, { password: 0, _id: 0 })
    }

    async getVideos(trainerId: string, page: number): Promise<ITutorialVideo> {
        const videosPerPage = 4;
        const skip = (page - 1) * videosPerPage;

        const videoData = await this._tutorialModal
            .findOne(
                { trainerId: trainerId },
                { videos: { $slice: [skip, videosPerPage] } }, { _id: 0 }
            )
            .lean();

        if (!videoData || videoData.videos.length === 0) {
            throw new Error(`No videos found for trainerId: ${trainerId}`);
        }
        return videoData;
    }

    async getTransaction(trainerId: string) {
        try {
            return await this._trainerModel.findOne({ trainerId: trainerId }, { transactionHistory: 1, _id: 0 })
        } catch (error: any) {
            throw new Error(`Error adding review: ${error.message}`);
        }
    }


    async editVideoDetails(trainerId: string, title: string, description: string, videoId: string) {
        try {
            return await this._tutorialModal.updateOne({ trainerId: trainerId, "videos.videoId": videoId },
                {
                    $set: {
                        "videos.$.title": title,
                        "videos.$.description": description
                    }
                }
            )
        } catch (error: any) {
            throw new Error(`Error adding review: ${error.message}`);
        }
    }

    async toggleVideoListing(trainerId: string, videoId: string, listed: string) {
        try {
            return await this._tutorialModal.updateOne({ trainerId: trainerId, "videos.videoId": videoId },
                {
                    $set: {
                        "videos.$.listed": listed,
                    }
                }
            )
        } catch (error: any) {
            throw new Error(`Error adding review: ${error.message}`);
        }
    }

    async getDashBoardData(trainerId: string, startDate: string, endDate: string): Promise<any | null> {
        try {
            const dashboardData = await this._trainerModel.aggregate([

                {
                    $match: { trainerId: trainerId }
                },

                {
                    $unwind: "$transactionHistory"
                },

                {
                    $match: {
                        "transactionHistory.createdAt": {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                },

                {
                    $project: {
                        day: { $dateToString: { format: "%Y-%m-%d", date: "$transactionHistory.createdAt" } },
                        userId: "$transactionHistory.userId",
                        transactionHistory: 1,
                    }
                },

                {
                    $group: {
                        _id: "$day",
                        subscribedUsers: { $addToSet: "$userId" },
                        totalTransactionsCount: { $sum: 1 },
                    }
                },

                {
                    $project: {
                        _id: 0,
                        day: "$_id",
                        totalTransactionsCount: 1,
                        subscribedUsersCount: { $size: "$subscribedUsers" }
                    }
                },

                {
                    $sort: { day: -1 }
                }
            ]);

            if (!dashboardData || dashboardData.length === 0) {
                throw new Error('No transactions found for the specified date range');
            }

            return dashboardData;
        } catch (error: any) {
            throw new Error(`Error retrieving dashboard data: ${error.message}`);
        }
    }

    async getTotalCountOfTrainerData(trainerId: string): Promise<any> {
        const data = await this._trainerModel.aggregate([
            { $match: { trainerId: trainerId } },
            {
                $lookup: {
                    from: "tutorialvideos",
                    localField: "trainerId",
                    foreignField: "trainerId",
                    as: "videoData"
                }
            },
            {
                $unwind: "$videoData"
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "trainerId",
                    foreignField: "trainerId",
                    as: "reviewData"
                }
            },
            {
                $unwind: "$videoData"
            },

        ])
        if (data[0]) {
            return {
                videosCount: data[0]?.videoData.videos.length,
                totalRevenue: data[0]?.wallet,
                totalReview: data[0]?.reviewData.length,
                newReviews: data[0].reviewData[0].review
            }
        } else return null
    }

    async getAllReview(trainerId: string): Promise<any> {
        const review = await this._trainerModel.aggregate([
            { $match: { trainerId: trainerId } },
            {
                $lookup: {
                    from: "reviews",
                    localField: "trainerId",
                    foreignField: "trainerId",
                    as: "reviewData"
                }
            },
        ])
        return {
            reviews: review[0].reviewData[0].review
        }
    }
}