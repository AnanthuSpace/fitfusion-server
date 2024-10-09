import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";
import dotenv from 'dotenv';
dotenv.config();
import ChatService from "../services/chatService";
import { ChatRepository } from "../repositories/chatRepository";
import { UserRepository } from "../repositories/userRepository";
import { TrainerRepository } from "../repositories/trainerRepository";
import { chatModel } from "../models/chatModal";
import { userModel } from "../models/userModel";
import { trainerModel } from "../models/trainerModel";
import DietPlan from "../models/dietModal";
import { ReviewModal } from "../models/reviewModal";
import { TutorialVideoModal } from "../models/tutorialVideoModal";
const clientURL = process.env.clientURL as string;
const localhostURL = process.env.localhostURL as string

export const configureSocket = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: [localhostURL, clientURL],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const chatRepository = new ChatRepository(chatModel);
  const userRepository = new UserRepository(userModel, trainerModel, DietPlan, ReviewModal, TutorialVideoModal);
  const trainerRepository = new TrainerRepository(trainerModel, userModel, DietPlan, TutorialVideoModal);
  const chatService = new ChatService(chatRepository, userRepository, trainerRepository);
  const isOnline: { [key: string]: string } = {}

  io.on("connection", (socket: Socket) => {

    // Normal Chatting configerations
    socket.on("joinRoom", ({ sender, reciver }: { sender: string; reciver: string }) => {
      const room = [sender, reciver].sort().join("-")

      isOnline[sender] = socket.id;
      console.log(isOnline);
      
      socket.join(room);
      if (isOnline[reciver]) {
        console.log(true,reciver);
        
        io.emit("userIsOnline", { user_id: reciver })
      } else {   
        console.log(false, reciver); 
        io.emit("userIsOffline", { user_id: reciver })
      }
      console.log(`User joined room: ${room}`);
    });

    socket.on("enterTheChatPage", ({ user }) => {
      isOnline[user] = socket.id;
      console.log(`User ${user} is now online`);
      console.log(isOnline);
      
    })

    socket.on("leaveTheChatPage", ({ user }) => {
      delete isOnline[user];
      console.log(`User ${user} is now offline`);
      io.emit("userIsOffline", { user_id: user })
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

        let savedMessage: null | any = null

        if (firstTimeChat === true) {
          const connectionDetails = await chatService.createConnectionAndSaveMessageService(formattedMessage);
          savedMessage = connectionDetails[2].details[0];
          console.log("connectionDetails : ", connectionDetails[2].details[0]);
        } else {
          savedMessage = await chatService.saveMessageService(message.senderId, message.recieverId, message.text);
        };
        const chatRoom = [message.senderId, message.recieverId].sort().join("-");
        io.to(chatRoom).emit("receiveMessage", savedMessage);
      } catch (error) {
        console.error("Error handling sendMessage event:", error);
      }
    });


    // Video call Configeration
    socket.on("joinVideoRoom", ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
      const room = [senderId, receiverId].sort().join("_");
      console.log(`Room joined: ${room} by ${senderId}`)
      socket.join(room);
    });


    socket.on("offer", ({ offer, roomId }) => {
      console.log(`Offer received for room video call${roomId}`);
      socket.to(roomId).emit("offer", offer);
    });


    socket.on("answer", ({ answer, roomId }) => {
      console.log(`Answer received for room ${roomId}`);
      socket.to(roomId).emit("answer", answer);
    });


    socket.on("ice-candidate", ({ candidate, roomId }) => {
      console.log(`ICE candidate received for room ${roomId}`);
      socket.to(roomId).emit("ice-candidate", candidate);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};