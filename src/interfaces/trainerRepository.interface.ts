import { EditTrainerInterface, IDietPlan, ITutorialVideo } from "./common/Interfaces";
import { TrainerHistory, TrainerType } from "./common/types";
import { UserType } from "./common/types";


export interface ITrainerRepository {
    findTrainerInRegister(email: string): Promise<TrainerType | null>;
    registerTrainer(trainerData: TrainerType): Promise<TrainerType>;
    registerThroghGoogle(trainerId: string, name: string, email: string, password: string) : Promise<any>
    editTrainer(editTrainerData: EditTrainerInterface, trainerId: string): Promise<any>;
    changePass(newPassword: string, trainerId: string): Promise<any>;
    findEditingData(trainerId: string): Promise<TrainerType | null>;
    profileUpdate(trainerId: string, uploadResult: any): Promise<any>;
    updateTrainerSubscription(trainerId: string, userId: string , userName: string, amount: number): Promise<void>;
    fetchCustomer(userIds: string[]): Promise<UserType[]>;
    fetchDeitPlans(trainerId: string): Promise<IDietPlan[]>;
    AddDietPlan(dietPlan: IDietPlan): Promise<IDietPlan>;
    existedDiet(trainerId: string, dietName: string): Promise<boolean>;
    addNewConnectionToAlreadyChattedTrainerListRepository(trainerId: string, userId: string): Promise<any>;
    fetchAlreadyChatted(alreadyChatted: string[]): Promise<Partial<UserType>[]>;
    ratingUpdate(trainerId: string, updatedAverageRating: number): Promise<any>;
    videoUpload(trainerId: string, videoUploadResult: any, thumbnailUploadResult: any, title: string, description: string): Promise<any>
    profileFetch(trainerId: string) : Promise<any>
    getVideos(trainerId: string, page: number): Promise<ITutorialVideo>
    getTransaction(userId: string): Promise<TrainerHistory[] | any>
}
