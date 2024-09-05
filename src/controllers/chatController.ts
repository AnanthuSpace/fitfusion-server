import { Request, Response } from 'express';
import { IChatService } from '../interfaces/chatService.interface';


class ChatController {
  private _chatService: IChatService

  constructor(chatService: IChatService) {
    this._chatService = chatService
  }

  fetchChat = async (req: Request, res: Response) => {
    try {
      const senderId = req.query.trainerId as string;
      const receiverId = req.query.userId as string;
      const chatHistory = await this._chatService.fetchChat(senderId, receiverId);
      res.status(200).json(chatHistory);
    } catch (error) {
      res.status(500).json(error);
    };
  };
}


export default ChatController

