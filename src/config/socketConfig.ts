import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";

export const configureSocket = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:5173", 
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("A user connected");

    socket.on("joinRoom", ({ userId, trainerId }: { userId: string; trainerId: string }) => {
      const room = `${userId}-${trainerId}`;
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    socket.on("chatMessage", ({ senderId, receiverId, message }: { senderId: string; receiverId: string; message: string }) => {
      const room = `${senderId}-${receiverId}`;
      io.to(room).emit("chatMessage", { senderId, message });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};



// import { Server as HttpServer } from "http";
// import { ChatService } from "../services/chatService";

// const chatServiceInstance = new ChatService();
// let io: SocketServer;

// const configSocketIO = (server: HttpServer) => {
//   io = new SocketServer(server, {
//     cors: {
//       origin: "http://localhost:5173",
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     socket.on("joinChatRoom", ({ senderID, receiverID }) => {
//       const roomName = [senderID, receiverID].sort().join("-");
//       socket.join(roomName);
//       console.log(`User ${senderID} joined room: ${roomName}`);
//     });

//     socket.on("sendMessage", async ({ messageDetails, firstTimeChat }) => {
//       try {
//         let savedMessage: any = null;
//         if (firstTimeChat === true) {
//           const connectionDetails: any = await chatServiceInstance.createConnectionAndSaveMessageService(messageDetails);
//           savedMessage = connectionDetails?.details[0];
//         } else {
//           savedMessage = await chatServiceInstance.saveNewChatService(messageDetails.senderID, messageDetails.receiverID, messageDetails.message);
//         }
//         const chatRoom = [messageDetails.senderID, messageDetails.receiverID].sort().join("-");
//         io.to(chatRoom).emit("receiveMessage", savedMessage);
//       } catch (error) {
//         console.error(error);
//       }
//     });

//     socket.on("joinTrainerNoficationRoom", (trainnerId) => {
//       socket.join(`TrainerNotificaionRoom${trainnerId}`);
//       console.log(`Trainer ${trainnerId} joined his notification room`);
//     });

//     socket.on("disconnect", () => {
//       console.log(`User disconnected: ${socket.id}`);
//     });
//   });
// };

// export { configSocketIO, io };


