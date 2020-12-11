import { Schema, model, ObjectId } from 'mongoose';

const schema = new Schema(
  {
    user: { type: ObjectId, ref: 'users' },
    token: { type: String, required: true, unique: true },
    expires: Date,
    createdByIp: String,
    revoked: Date,
    revokedByIp: String,
    replacedByToken: String,
  },
  { timestamps: true }
);

schema.virtual('isExpired').get(function () {
  return Date.now() >= this.expires;
});

schema.virtual('isActive').get(function () {
  return !this.revoked && !this.isExpired;
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.id;
    delete ret.user;
  },
});

export const RefreshToken = model('RefreshToken', schema);
