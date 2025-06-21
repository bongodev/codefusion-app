import mongoose, { Schema, Document } from "mongoose";
import { User as UserType } from "../types";

export interface UserDocument extends Omit<UserType, "_id">, Document {
  _id: mongoose.Types.ObjectId;
}

const userSchema = new Schema<UserDocument>(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    picture: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        ret._id = ret._id.toString();
        return ret;
      },
    },
  }
);

// Indexes for performance
userSchema.index({ googleId: 1 });
userSchema.index({ email: 1 });

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
