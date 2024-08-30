// import { ChatType, chatModel } from "../models/chatModal";
// import { MessageType, MessageDetailType } from "../Interfaces";

// export class ChatRepository {
//   async createChat(userId: string, trainerId: string): Promise<ChatType> {
//     const chat = new chatModel({ userId, trainerId, details: [] });
//     return await chat.save();
//   }

//   async findChat(userId: string, trainerId: string): Promise<ChatType | null> {
//     return await chatModel.findOne({ userId, trainerId }).exec();
//   }

//   async getMessages(senderId: string, receiverId: string): Promise<MessageDetailType[]> {
//     const chat = await chatModel
//       .findOne({ chatMembers: { $all: [senderId, receiverId] } })
//       .select('details')
//       .exec();
//     return chat ? chat.details : [];
//   }

//   async saveNewChatRepository(newMessageDetails: MessageType) {
//     try {
//       return chatModel.updateOne(
//         { chatMembers: { $all: [newMessageDetails.chatMembers[0], newMessageDetails.chatMembers[1]] } },
//         { $push: { details: newMessageDetails.details[0] } },
//         { upsert: true }
//       );
//     } catch (error) {
//       console.error("Error during save new chat operation:", error);
//       throw error;
//     }
//   };

//   async createConnectionAndSaveMessageRepository(newChatDocument: MessageType) {
//     try {
//       return await chatModel.create(newChatDocument);
//     } catch (error) {
//       throw error;
//     }
//   };
// }

import Chat from "../models/chatModal";

export const getChatMessages = async (senderId: string, receiverId: string) => {
  try {
    const chatMessages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ timestamp: 1 }); // Assuming you have a timestamp field for sorting messages

    return chatMessages;
  } catch (error) {
    console.error('Error fetching chat messages from DB:', error);
    throw error;
  }
};

export const saveChatMessage = async (senderId: string, receiverId: string, message: string) => {
  try {
    const chatMessage = new Chat({
      senderId,
      receiverId,
      message,
      timestamp: new Date()
    });
    return await chatMessage.save();
  } catch (error) {
    console.error('Error saving chat message to DB:', error);
    throw error;
  }
};

