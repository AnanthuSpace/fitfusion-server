import { Request, Response } from 'express';
import chatService from '../services/chatService';




class ChatController {
  async startChat(req: Request, res: Response) {
    const { userId, trainerId } = req.body;
   
    try {
      const chat = await chatService.startChat(userId, trainerId);
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
  }

  async getMessages(req: Request, res: Response) {
    const { chatId } = req.body;
    try {
      const messages = await chatService.getChatMessages(chatId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
  }
}

export default new ChatController();
