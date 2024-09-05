import { MessageType, MessageDetailType } from './common/Interfaces';

export interface IChatService {
  fetchChat(senderId: string, receiverId: string): Promise<MessageDetailType[]>;
  saveMessageService(senderID: string, receiverID: string, message: string): Promise<MessageDetailType>;
  createConnectionAndSaveMessageService(message: Omit<MessageType, 'chatMembers'>): Promise<any[]>; 
}
