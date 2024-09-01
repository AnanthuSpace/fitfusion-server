import { Schema, model } from "mongoose";

interface ChatType {
  chatMembers?: string[];
  details: {
    senderId: string;
    receiverId: string;
    messages: string;
    time?: Date;
  }[];
  createdAt: Date;
}

const chatSchema = new Schema<ChatType>({
  chatMembers: [
    {
      type: String,
    }
  ],
  details: [{
    senderId: {
      type: String,
    },
    receiverId: {
      type: String,
    },
    messages: {
      type: String,
    },
    time: {
      type: Date,
      default: Date.now,
    }
  }],
  createdAt: { type: Date, default: Date.now }
});

const chatModel = model<ChatType>("Chat", chatSchema);

export { chatModel, ChatType };

