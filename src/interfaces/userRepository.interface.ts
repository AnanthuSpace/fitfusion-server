import { UserType, FullReviewType, TrainerType, TransactionHistory } from './common/types';
import { EditUserInterface } from './common/Interfaces';

export interface IUserRepository {
  findUser(email: string): Promise<UserType | null>;
  fetchUser(userId: string): Promise<UserType | null>;
  registerUser(userData: UserType): Promise<UserType>;
  resetPassword(email: string, password: string): Promise<any>;
  activeUser(email: string): Promise<any>;
  inactiveUser(userId: string): Promise<any>;
  editUser(editUserData: EditUserInterface, userId: string): Promise<any>;
  addUserDetails(userId: string, userDetails: UserType): Promise<any>;
  changePass(newPassword: string, userId: string): Promise<any>;
  findEditingData(userId: string): Promise<UserType | null>;
  registerThroghGoogle(userId: string, name: string, email: string, hashedPassword: string): Promise<any>;
  blockUser(userId: string): Promise<any>;
  fetchTrainers(): Promise<TrainerType[]>;
  updateUserAfterPayment(userId: string, trainerId: string, trainerName: string, amount: number): Promise<any>;
  addNewConnectionToAlreadyChattedTrainerListRepository(userId: string, trainerId: string): Promise<any>;
  fetchAlreadyChattedTrainer(alreadyChatted: string[], userId: string): Promise<TrainerType[]>;
  fetchDeitPlans(trainerId: string): Promise<any>;
  fetchTrainerScroll(page: number): Promise<any>;
  addReview(reviewData: FullReviewType, trainerId: string): Promise<any>;
  fetchReview(trainerId: string): Promise<any>
  fetchSingleTrainer(trainerId: string): Promise<any>
  fetchVideos(trainerId: string): Promise<any>
  fetchAllVideos(trainerIds: string[], searchTerm: string, categories: string[], sortOption: string): Promise<any>
  getTransactionHostory(userId: string): Promise<TransactionHistory[] | any>
  findTransaction(userId: string, transactionId: string): Promise<any>
  unsubscribeTransaction(userId: string, trainerId: string): Promise<TransactionHistory[] | any>
  updateUserTransactionAndSubscription(userId: string, transactionId: string, trainerId: string, refundAmount: number): Promise<any>
}
