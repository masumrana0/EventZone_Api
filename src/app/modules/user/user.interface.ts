/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IUser = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  photoURL: string;
};

export type UserModel = {
  isUserExist(email: string): Promise<IUser>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;
