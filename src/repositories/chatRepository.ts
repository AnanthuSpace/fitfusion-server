import { IChat } from "../interfaces/common/Interfaces";
import { MessageType, MessageDetailType } from "../interfaces/common/Interfaces";
import { IChatRepository } from "../interfaces/chatRepository.interface";
import { Model } from "mongoose";

export class ChatRepository implements IChatRepository {
  private _chatModel: Model<IChat>;

  constructor(chatModel: Model<IChat>) {  
    this._chatModel = chatModel;
  }


  async createChat(userId: string, trainerId: string): Promise<IChat> {
    const chat = new this._chatModel({ userId, trainerId, details: [] });
    return await chat.save();
  }

  async findChat(userId: string, trainerId: string): Promise<IChat | null> {
    return await this._chatModel.findOne({ userId, trainerId }).exec();
  }

  async getMessages(senderId: string, receiverId: string): Promise<MessageDetailType[]> {
    const chat = await this._chatModel.findOne({ chatMembers: { $all: [senderId, receiverId] } })
    return chat ? chat.details : [];
  }

  async saveNewChatRepository(newMessageDetails: MessageDetailType) {
    try {
      return this._chatModel.updateOne(
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
      return await this._chatModel.create(newChatDocument);
    } catch (error) {
      throw error;
    }
  };
}
