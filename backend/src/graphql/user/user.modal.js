import { Schema, model, ObjectId } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    hash: { type: String, required: true, select: false },
    phone: String,
    verified: { type: Boolean, default: false },
    image: String,
    contacts: [{ type: ObjectId, ref: 'users', required: true }],
    logs: { lastLogin: Date, lastPasswordReset: Date, last_activity: Date },
    state: { online: Boolean, available: Boolean },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = model('users', UserSchema);

export { User };
