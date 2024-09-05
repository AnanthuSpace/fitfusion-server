import { IChat } from "./common/Interfaces";
import { MessageType, MessageDetailType } from "./common/Interfaces";

export interface IChatRepository {
  createChat(userId: string, trainerId: string): Promise<IChat>;
  findChat(userId: string, trainerId: string): Promise<IChat | null>;
  getMessages(senderId: string, receiverId: string): Promise<MessageDetailType[]>;
  saveNewChatRepository(newMessageDetails: MessageDetailType): Promise<any>; 
  createConnectionAndSaveMessageRepository(newChatDocument: MessageType): Promise<IChat>; 
}
