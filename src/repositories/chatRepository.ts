import { chatModel } from "../models/chatModal";
import { IChat } from "../interfaces/common/Interfaces";
import { MessageType, MessageDetailType } from "../interfaces/common/Interfaces";
import { IChatRepository } from "../interfaces/chatRepository.interface";

export class ChatRepository implements IChatRepository {
  async createChat(userId: string, trainerId: string): Promise<IChat> {
    const chat = new chatModel({ userId, trainerId, details: [] });
    return await chat.save();
  }

  async findChat(userId: string, trainerId: string): Promise<IChat | null> {
    return await chatModel.findOne({ userId, trainerId }).exec();
  }

  async getMessages(senderId: string, receiverId: string): Promise<MessageDetailType[]> {
    const chat = await chatModel.findOne({ chatMembers: { $all: [senderId, receiverId] } })
    return chat ? chat.details : [];
  }

  async saveNewChatRepository(newMessageDetails: MessageDetailType) {
    try {
      return chatModel.updateOne(
        {
          $or: [
            { chatMembers: { $elemMatch: { $eq: newMessageDetails.senderId } } },
            { chatMembers: { $elemMatch: { $eq: newMessageDetails.receiverId } } }
          ]
        },
        { $push: { details: newMessageDetails } },
        { upsert: true }
      );

    } catch (error) {
      console.error("Error during save new chat operation:", error);
      throw error;
    }
  };

  async createConnectionAndSaveMessageRepository(newChatDocument: MessageType) {
    try {
      return await chatModel.create(newChatDocument);
    } catch (error) {
      throw error;
    }
  };
}
