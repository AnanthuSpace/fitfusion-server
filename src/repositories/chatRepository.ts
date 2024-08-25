import { ChatType, chatModel } from "../models/chatModal";

class ChatRepository {
  

    async createChat(userId: string, trainerId: string): Promise<ChatType> {
        const chat = new chatModel({ userId, trainerId, messages: [] });
        return await chat.save();
      }
      


  async findChat(userId: string, trainerId: string): Promise<ChatType | null> {
    return await chatModel.findOne({ userId, trainerId }).exec();
  }


  async addMessage(chatId: string, sender: 'user' | 'trainer', text: string): Promise<ChatType | null> {
    return await chatModel.findByIdAndUpdate(
      chatId,
      { $push: { messages: { sender, text, timestamp: new Date() } } },
      { new: true } 
    ).exec();
  }

  
  async getMessages(chatId: string): Promise<ChatType | null> {
    return await chatModel.findById(chatId).select('messages').exec();
  }
}

export default new ChatRepository();
