import { MessageType, MessageDetailType } from '../interfaces/common/Interfaces';
import { IChatRepository } from '../interfaces/chatRepository.interface';
import { IUserRepository } from '../interfaces/userRepository.interface';
import { ITrainerRepository } from '../interfaces/trainerRepository.interface';
import { IChatService } from '../interfaces/chatService.interface';


class ChatService implements IChatService {

  private _chatRepository: IChatRepository;
  private _userRepository: IUserRepository;
  private _trainerRepository: ITrainerRepository;

  constructor(chatRepository: IChatRepository, userRepository: IUserRepository, trainerRepository: ITrainerRepository) {
    this._chatRepository = chatRepository;
    this._userRepository = userRepository;
    this._trainerRepository = trainerRepository;
  }

  fetchChat = async (senderId: string, receiverId: string) => {
    try {
      const result = await this._chatRepository.getMessages(senderId, receiverId);
      return result
    } catch (error) {
      throw error;
    }
  }

  saveMessageService = async (senderID: string, receiverID: string, message: string) => {
    try {
      const newMessageDetails: MessageDetailType = {
        senderId: senderID,
        receiverId: receiverID,
        messages: message,
        time: new Date()
      };
      await this._chatRepository.saveNewChatRepository(newMessageDetails);
      return newMessageDetails;
    } catch (error) {
      throw error;
    }
  }

 createConnectionAndSaveMessageService = async (message: Omit<MessageType, 'chatMembers'>) => {
    try {


      const newChatDocument: MessageType = {
        chatMembers: [message.details[0].senderId, message.details[0].receiverId],
        details: message.details
      };

      const connectionDetails = await Promise.all([
        this._userRepository.addNewConnectionToAlreadyChattedTrainerListRepository(newChatDocument.details[0].receiverId, newChatDocument.details[0].senderId),
        this._trainerRepository.addNewConnectionToAlreadyChattedTrainerListRepository(newChatDocument.details[0].senderId, newChatDocument.details[0].receiverId),
        this._chatRepository.createConnectionAndSaveMessageRepository(newChatDocument)
      ]);

      return connectionDetails;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default ChatService;