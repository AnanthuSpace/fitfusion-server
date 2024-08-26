import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';

const chatService = new ChatService();


export class ChatController {
  async fetchChat(req: Request, res: Response) {
      try {
        const senderID = req.query.senderID as string;
        const receiverID = req.query.receiverID as string;
        const chatHistory = await chatService.fetchChat(senderID, receiverID);
        res.status(200).json(chatHistory);
      } catch (error) {
        res.status(500).json(error);
      };
    };
}
