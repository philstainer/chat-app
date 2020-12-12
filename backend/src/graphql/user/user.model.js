import { Schema, model, ObjectId } from 'mongoose';

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    phone: String,
    image: String,
    contacts: [{ type: ObjectId, ref: 'users', required: true }],
    logs: { lastLogin: Date, lastPasswordReset: Date, lastActivity: Date },
    state: { online: Boolean, available: Boolean },
    verifyToken: String,
    verified: { type: Boolean, default: false },
    resetToken: String,
    resetTokenExpiry: Date,
    blocked: Boolean,
  },
  { timestamps: true }
);

export const User = model('users', UserSchema);
