import { Schema, model } from "mongoose";
import { IChat } from "../Interfaces";

const chatSchema = new Schema<IChat>({
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

const chatModel = model<IChat>("Chat", chatSchema);

export { chatModel };

