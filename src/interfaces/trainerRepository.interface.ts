import { EditTrainerInterface, IDietPlan } from "./common/Interfaces";
import { TrainerType } from "./common/types";
import { UserType } from "./common/types";


export interface ITrainerRepository {
    findTrainerInRegister(email: string): Promise<TrainerType | null>;
    registerTrainer(trainerData: TrainerType): Promise<TrainerType>;
    editTrainer(editTrainerData: EditTrainerInterface, trainerId: string): Promise<any>;
    changePass(newPassword: string, trainerId: string): Promise<any>;
    findEditingData(trainerId: string): Promise<TrainerType | null>;
    profileUpdate(trainerId: string, uploadResult: any): Promise<any>;
    updateTrainerSubscription(trainerId: string, userId: string): Promise<void>;
    fetchCustomer(userIds: string[]): Promise<UserType[]>;
    fetchDeitPlans(trainerId: string): Promise<IDietPlan[]>;
    AddDietPlan(dietPlan: IDietPlan): Promise<IDietPlan>;
    existedDiet(trainerId: string, dietName: string): Promise<boolean>;
    addNewConnectionToAlreadyChattedTrainerListRepository(trainerId: string, userId: string): Promise<any>;
    fetchAlreadyChatted(alreadyChatted: string[]): Promise<Partial<UserType>[]>;
    ratingUpdate(trainerId: string, updatedAverageRating: number): Promise<any>;
    addTrainerVideo(trainerId: string, videoUrl: string): Promise<void>;
    profileImgFetch(trainerId: string): Promise<string>;
}
