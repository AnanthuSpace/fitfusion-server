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

    socket.on("joinRoom", ({ sender, reciver }: { sender: string; reciver: string }) => {
      const room = [sender, reciver].sort().join("-")

      isOnline[sender] = socket.id;
      console.log(isOnline);

      socket.join(room);
      if (isOnline[reciver]) {
        console.log(true, reciver);

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

    socket.on("sendMessage", async ({ message, firstTimeChat, isUser = false }) => {
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
          const connectionDetails = await chatService.createConnectionAndSaveMessageService(formattedMessage, isUser);
          savedMessage = connectionDetails[2].details[0];
        } else {
          savedMessage = await chatService.saveMessageService(message.senderId, message.recieverId, message.text);
          console.log(savedMessage)
        };
        const chatRoom = [message.senderId, message.recieverId].sort().join("-");
        io.to(chatRoom).emit("receiveMessage", savedMessage);
      } catch (error) {
        console.error("Error handling sendMessage event:", error);
      }
    });


    // Block user
    socket.on("blockTheUser", (data) => {
      const { userId } = data
      io.emit("isUserBlocked", {
        from: socket.id,
        blockedId: userId,
      })
    })

    // Block Trainer
    socket.on("blockTheTrainer", (data) => {
      const { trainerId } = data
      io.emit("isTrainerBlocked", {
        from: socket.id,
        blockedId: trainerId,
      })
    })


    // Video call Configeration

    socket.on("startCall", (data) => {
      const { receivedId, receiverName } = data;

      io.emit("incomingCall", {
        from: socket.id,
        callerId: receivedId,
        callerName: receiverName,
      });
    });

    socket.on("offer", (data) => {
      socket.to(data.roomId).emit("offer", data.offer);
    });

    socket.on("answer", (data) => {
      socket.to(data.roomId).emit("answer", data.answer);
    });

    socket.on("ice-candidate", (data) => {
      socket.to(data.roomId).emit("ice-candidate", data.candidate);
    });


    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};