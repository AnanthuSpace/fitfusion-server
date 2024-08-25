import chatRepository from '../repositories/chatRepository';


class ChatService {
  async startChat(userId: string, trainerId: string) {
    let chat = await chatRepository.findChat(userId, trainerId);
    if (!chat) {
      chat = await chatRepository.createChat(userId, trainerId);
    }
    return chat;
  }

  async sendMessage(chatId: string, sender: 'user' | 'trainer', text: string) {
    return chatRepository.addMessage(chatId, sender, text);
  }

  async getChatMessages(chatId: string) {
    return chatRepository.getMessages(chatId);
  }
}

export default new ChatService();
