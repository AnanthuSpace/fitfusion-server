import { Schema, model, Document } from "mongoose";

interface ChatType extends Document {
  userId: string;
  trainerId: string;
  messages: {
    sender: 'user' | 'trainer';
    text: string;
    timestamp: Date;
  }[];
  createdAt: Date;
}

const chatSchema = new Schema<ChatType>({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  trainerId: {
    type: String,
    ref: 'Trainer',
    required: true,
  },
  messages: [
    {
      sender: {
        type: String,
        enum: ['user', 'trainer'],
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const chatModel = model<ChatType>("Chat", chatSchema);

export { chatModel, ChatType };
