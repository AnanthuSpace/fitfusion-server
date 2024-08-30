// import { ChatRepository } from '../repositories/chatRepository';
// import { TrainerRepository } from '../repositories/trainerRepository';
// import { UserRepository } from '../repositories/userRepository';
// import { MessageType } from '../Interfaces';


// export class ChatService {

//   private chatRepository: ChatRepository;
//   private userRepository: UserRepository;
//   private trainerRepository: TrainerRepository;

//   constructor() {
//     this.chatRepository = new ChatRepository();
//     this.userRepository = new UserRepository();
//     this.trainerRepository = new TrainerRepository();
//   }

//   async fetchChat(senderId: string, receiverId: string) {
//     return await this.chatRepository.getMessages(senderId, receiverId);
//   }

//   async saveNewChatService(senderID: string, receiverID: string, message: string) {
//     try {
//       const newMessageDetails: MessageType = {
//         chatMembers: [senderID, receiverID],  
//         details: [
//           {
//             senderID: senderID,
//             receiverID: receiverID,
//             messages: message,
//             time: new Date()  
//           }
//         ]
//       };
  
//       await this.chatRepository.saveNewChatRepository(newMessageDetails);
//       return newMessageDetails;
//     } catch (error) {
//       throw error;
//     }
//   }
  
//   async createConnectionAndSaveMessageService(messageDetails: MessageType) {
//     try {
//       const newChatDocument: MessageType = {
//         chatMembers: [messageDetails.details[0].senderID, messageDetails.details[0].receiverID],
//         details: [{
//           senderID: messageDetails.details[0].senderID,
//           receiverID: messageDetails.details[0].receiverID,
//           messages: messageDetails.details[0].messages,
//           time: new Date()
//         }]
//       };

//       const connectionDetails = this.chatRepository.createConnectionAndSaveMessageRepository(newChatDocument);

//       await Promise.all([
//         this.userRepository.addNewConnectionToAlreadyChattedTrainerListRepository(newChatDocument.details[0].receiverID, newChatDocument.details[0].senderID),
//         this.trainerRepository.addNewConnectionToAlreadyChattedTrainerListRepository(newChatDocument.details[0].receiverID, newChatDocument.details[0].senderID),
//         connectionDetails
//       ]);

//       return connectionDetails;
//     } catch (error) {
//       return error;
//     }
//   }

// }
