import { UserType, TrainerType } from "../interfaces/common/types";
import { IAdminRepository } from "../interfaces/adminRepository.interface";
import { Model } from "mongoose";

export class AdminRepository implements IAdminRepository {
    private _trainerModel: Model<TrainerType>
    private _userModel: Model<UserType>

    constructor(trainerModel: Model<TrainerType>, userModel: Model<UserType>) {
        this._trainerModel = trainerModel
        this._userModel = userModel
    }

    async findAllUsers(): Promise<UserType[]> {
        return this._userModel.find({}, { _id: 0, password: 0 });
    }

    async findAllTrainers(): Promise<TrainerType[]> {
        return this._trainerModel.find({}, { _id: 0, password: 0 });
    }

    async blockUser(userId: string): Promise<any> {
        return this._userModel.updateOne(
            { userId: userId },
            { $set: { isBlocked: true } }
        );
    }

    async unblockUser(userId: string): Promise<any> {
        return this._userModel.updateOne(
            { userId: userId },
            { $set: { isBlocked: false } }
        );
    }

    async blockTrainer(trainerId: string): Promise<any> {
        return this._trainerModel.updateOne(
            { trainerId: trainerId },
            { $set: { isBlocked: true } }
        );
    }

    async unblockTrainer(trainerId: string): Promise<any> {
        return this._trainerModel.updateOne(
            { trainerId: trainerId },
            { $set: { isBlocked: false } }
        );
    }

    async isVerified(trainerId: string, isVerified: string): Promise<any> {
        console.log(trainerId);

        return this._trainerModel.updateOne(
            { email: trainerId },
            { $set: { verified: isVerified } }
        );
    }

    async fetchTrainers(page: number): Promise<TrainerType[]> {
        return this._trainerModel.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * 5)
            .limit(Number(5))
            .select('-_id');
    }

    async fetchUsers(page: number): Promise<UserType[]> {
        return this._userModel.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * 5)
            .limit(Number(5))
            .select('-_id');
    }

    async fetchIndividualTrainer(trainerId: string): Promise<TrainerType | null> {
        return this._trainerModel.findOne({ trainerId: trainerId }, { _id: 0 }).lean()
    }

    async deleteTrainer(trainerId: string): Promise<any> {
        return this._trainerModel.deleteOne({ email: trainerId });
    }

    async findUserDatas(startDate: Date, endDate: Date): Promise<any> {
        try {
            const users = await this._userModel.find({
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });

            const trainers = await this._trainerModel.find({
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });

            const formatDate = (date: Date) => date.toISOString().split("T")[0];

            const countOccurrences = (data: any[]) => {
                return data.reduce((acc, item) => {
                    const date = formatDate(item.createdAt);
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});
            };

            const userCounts = countOccurrences(users);
            const trainerCounts = countOccurrences(trainers);

            const allDates = new Set([...Object.keys(userCounts), ...Object.keys(trainerCounts)]);
            const resultData = Array.from(allDates).map((date) => ({
                date,
                users: userCounts[date] || 0,
                trainers: trainerCounts[date] || 0,
            }));

            return {
                success: true,
                data: resultData,
            };
        } catch (error) {
            console.error("Error finding user data:", error);
            throw error;
        }
    }

    async fetchNewUsersAndTrainers(): Promise<any> {
        const lastFourUsers = await this._userModel
            .find()
            .sort({ createdAt: -1 })
            .limit(4)
            .select('name userId');
    
        const lastFourTrainers = await this._trainerModel
            .find()
            .sort({ createdAt: -1 })
            .limit(4)
            .select('name trainerId');
    
        const userCount = await this._userModel.countDocuments();
    
        const trainerCount = await this._trainerModel.countDocuments();
    
        const trainers = await this._trainerModel.find().select('wallet');
        const totalWallet = trainers.reduce((sum, trainer) => sum + trainer.wallet, 0);
    
        return {
            users: lastFourUsers,
            trainers: lastFourTrainers,
            userCount,
            trainerCount,
            totalWallet
        };
    }
}