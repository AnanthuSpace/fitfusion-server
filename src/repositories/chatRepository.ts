import { ChatType, chatModel } from "../models/chatModal";
import { MessageType, MessageDetailType } from "../Interfaces";

export class ChatRepository {
  async createChat(userId: string, trainerId: string): Promise<ChatType> {
    const chat = new chatModel({ userId, trainerId, details: [] });
    return await chat.save();
  }

  async findChat(userId: string, trainerId: string): Promise<ChatType | null> {
    return await chatModel.findOne({ userId, trainerId }).exec();
  }

  async getMessages(senderId: string, receiverId: string): Promise<MessageDetailType[]> {
    const chat = await chatModel
      .findOne({ chatMembers: { $all: [senderId, receiverId] } })
      .select('details')
      .exec();
    return chat ? chat.details : [];
  }

  async saveNewChatRepository(newMessageDetails: MessageType) {
    try {
      return chatModel.updateOne(
        { chatMembers: { $all: [newMessageDetails.chatMembers[0], newMessageDetails.chatMembers[1]] } },
        { $push: { details: newMessageDetails.details[0] } },
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
