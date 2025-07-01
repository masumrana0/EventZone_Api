/**
 * Title: 'User Model'
 * Description: ''
 * Author: 'Masum Rana'
 * Date: 30-06-2025
 *
 */

import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';

import {
  convertHashPassword,
  verifyPassword,
} from '../../../helper/passwordSecurityHelper';

const UserSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    photoURL: {
      type: String,
      default: 'https://avatar.iran.liara.run/public/boy',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// Pre-save middleware to hash the password
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = convertHashPassword(this.password);
  }
  next();
});

// Static method to check if a user exists by email
UserSchema.statics.isUserExist = async function (
  email: string,
): Promise<IUser | null> {
  return await this.findOne({ email: email }).select('+password').exec();
};

// Static method to compare passwords
UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return verifyPassword(givenPassword, savedPassword);
};

export const User = model<IUser, UserModel>('User', UserSchema);
