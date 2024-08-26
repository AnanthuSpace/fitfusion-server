import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { ChatService } from "../services/chatService";

const chatServiceInstance = new ChatService(); 
let io: SocketServer;

const configSocketIO = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinChatRoom", ({ senderID, receiverID }) => {
      const roomName = [senderID, receiverID].sort().join("-");
      socket.join(roomName);
      console.log(`User ${senderID} joined room: ${roomName}`);
    });

    socket.on("sendMessage", async ({ messageDetails, firstTimeChat }) => {
      try {
        let savedMessage: any = null;
        if (firstTimeChat === true) {
          const connectionDetails: any = await chatServiceInstance.createConnectionAndSaveMessageService(messageDetails);
          savedMessage = connectionDetails?.details[0];
        } else {
          savedMessage = await chatServiceInstance.saveNewChatService(messageDetails.senderID, messageDetails.receiverID, messageDetails.message);
        }
        const chatRoom = [messageDetails.senderID, messageDetails.receiverID].sort().join("-");
        io.to(chatRoom).emit("receiveMessage", savedMessage);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("joinTrainerNoficationRoom", (trainnerId) => {
      socket.join(`TrainerNotificaionRoom${trainnerId}`);
      console.log(`Trainer ${trainnerId} joined his notification room`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export { configSocketIO, io };
