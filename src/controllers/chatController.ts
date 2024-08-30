// import { Request, Response } from 'express';
// import { ChatService } from '../services/chatService';

// const chatService = new ChatService();


// export class ChatController {
//   async fetchChat(req: Request, res: Response) {
//       try {
//         const senderID = req.query.senderID as string;
//         const receiverID = req.query.receiverID as string;
//         const chatHistory = await chatService.fetchChat(senderID, receiverID);
//         res.status(200).json(chatHistory);
//       } catch (error) {
//         res.status(500).json(error);
//       };
//     };
// }

import { Request, Response } from 'express';
import { getChatMessages } from '../repositories/chatRepository'; // Ensure this path is correct

export const fetchChatMessages = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: 'Sender ID and Receiver ID are required' });
    }

    const chatMessages = await getChatMessages(senderId, receiverId);

    res.json(chatMessages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

