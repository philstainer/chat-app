import { Schema, model, ObjectId } from 'mongoose';

const ChatSchema = new Schema(
  {
    participants: [{ type: ObjectId, ref: 'users', required: true }],
    lastMessage: { type: ObjectId, ref: 'messages' },
  },
  { timestamps: true }
);

const Chat = model('chats', ChatSchema);

export { Chat };
