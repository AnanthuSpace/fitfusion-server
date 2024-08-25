import { Server as SocketIOServer, Socket } from 'socket.io';
import chatService from '../services/chatService';

export default (io: SocketIOServer) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (room: string) => {
      socket.join(room);
      console.log(`User with ID: ${socket.id} joined room: ${room}`);
    });

    socket.on('send_message', async (data: { chatId: string; sender: 'user' | 'trainer'; text: string; room: string; }) => {
      const { chatId, sender, text, room } = data;

      try {
        const updatedChat = await chatService.sendMessage(chatId, sender, text);

        if (updatedChat && updatedChat.messages.length > 0) {
          const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
          io.to(room).emit('receive_message', lastMessage);
        } else {
          console.error('Failed to update chat or chat is empty.');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
