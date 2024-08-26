import { Schema, model, Document } from "mongoose";

interface ChatType extends Document {
  chatMembers?: string[];
  details: {
    senderID: string;
    receiverID: string;
    messages: string;
    time?: Date;
  }[];
  createdAt?: Date;
}

const chatSchema = new Schema<ChatType>({
  chatMembers: [
    {
      type: String,
    }
  ],
  details: [{
    senderID: {
      type: String,
    },
    receiverID: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const chatModel = model<ChatType>("Chat", chatSchema);

export { chatModel, ChatType };
