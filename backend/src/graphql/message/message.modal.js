import { Schema, model, ObjectId } from 'mongoose';

const MessageSchema = new Schema(
  {
    chatId: { type: ObjectId, ref: 'chats', required: true },
    text: { type: String, required: true, trim: true },
    sender: { type: ObjectId, ref: 'users', required: true },
    deliveredTo: [{ type: ObjectId, ref: 'users', required: true }],
    seenBy: [{ type: ObjectId, ref: 'users', required: true }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Message = model('messages', MessageSchema);

export { Message };
