import { ChatRepository } from '../repositories/chatRepository';
import { TrainerRepository } from '../repositories/trainerRepository';
import { UserRepository } from '../repositories/userRepository';
import { MessageType, MessageDetailType } from '../Interfaces';


class ChatService {

    private chatRepository: ChatRepository;
    private userRepository: UserRepository;
    private trainerRepository: TrainerRepository;

    constructor() {
        this.chatRepository = new ChatRepository();
        this.userRepository = new UserRepository();
        this.trainerRepository = new TrainerRepository();
    }

      async fetchChat(senderId: string, receiverId: string) {
        try {
            const result =  await this.chatRepository.getMessages(senderId, receiverId);
            return result
        } catch (error) {
            throw error;
        }
      }

      async saveMessageService(senderID: string, receiverID: string, message: string) {
        try {
          const newMessageDetails: MessageDetailType = {
                senderId: senderID,
                receiverId: receiverID,
                messages: message,
                time: new Date()  
          };
          await this.chatRepository.saveNewChatRepository(newMessageDetails);
          return newMessageDetails;
        } catch (error) {
          throw error;
        }
      }

    async createConnectionAndSaveMessageService(message: Omit<MessageType, 'chatMembers'>) {
        try {
            
            
            const newChatDocument: MessageType = {
                chatMembers: [message.details[0].senderId, message.details[0].receiverId], 
                details: message.details 
            };

            const connectionDetails = await Promise.all([
                this.userRepository.addNewConnectionToAlreadyChattedTrainerListRepository(newChatDocument.details[0].receiverId, newChatDocument.details[0].senderId),
                this.trainerRepository.addNewConnectionToAlreadyChattedTrainerListRepository( newChatDocument.details[0].senderId, newChatDocument.details[0].receiverId),
                this.chatRepository.createConnectionAndSaveMessageRepository(newChatDocument)
            ]);

            return connectionDetails;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default ChatService;