import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";
import ChatService from "../services/chatService";
import { ChatRepository } from "../repositories/chatRepository";
import { UserRepository } from "../repositories/userRepository";
import { TrainerRepository } from "../repositories/trainerRepository";

export const configureSocket = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const chatRepository = new ChatRepository();
  const userRepository = new UserRepository();
  const trainerRepository = new TrainerRepository();

  const chatService = new ChatService(chatRepository, userRepository, trainerRepository);

  io.on("connection", (socket: Socket) => {

    socket.on("joinRoom", ({ userId, trainerId }: { userId: string; trainerId: string }) => {
      const room = [userId, trainerId].sort().join("-")
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });


    socket.on("sendMessage", async ({ message, firstTimeChat }) => {
      try {
        const formattedMessage = {
          details: [
            {
              senderId: message.senderId,
              receiverId: message.recieverId,
              messages: message.text,
              createdAt: new Date()
            }
          ]
        };
        console.log(formattedMessage);
        
      
        let savedMessage: null | any = null

        if (firstTimeChat === true) {
          const connectionDetails = await chatService.createConnectionAndSaveMessageService(formattedMessage);
          savedMessage = connectionDetails[2].details[0];
          console.log("connectionDetails : ",connectionDetails[2].details[0]);
       } else {
          savedMessage = await chatService.saveMessageService(message.senderId, message.recieverId, message.text);
       };
       const chatRoom = [message.senderId, message.recieverId].sort().join("-");
        io.to(chatRoom).emit("receiveMessage", savedMessage);
      } catch (error) {
        console.error("Error handling sendMessage event:", error);
      }
    });


    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};