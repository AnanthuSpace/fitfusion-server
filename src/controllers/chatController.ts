import { Request, Response } from 'express';
import  ChatService  from '../services/chatService';

const chatService = new ChatService();


class ChatController {
  async fetchChat(req: Request, res: Response) {
      try {
        console.log("Start");
        
        const senderId = req.query.trainerId as string;
        const receiverId = req.query.userId as string;      
        const chatHistory = await chatService.fetchChat(senderId, receiverId);
        res.status(200).json(chatHistory);
      } catch (error) {
        res.status(500).json(error);
      };
    };
}


export default ChatController

