import { startSession } from 'mongoose';

import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createUser = async (payload: IUser): Promise<IUser> => {
  const isNotUniqueEmail = await User.isUserExist(payload.email);
  if (isNotUniqueEmail) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Sorry, this email address is already in use.',
    );
  }

  const session = await startSession();
  session.startTransaction();

  try {
    // Create User
    const user = await User.create(payload);

    // await AuthService.sendVerificationEmail({ email: user?.email });

    // Login User
    return user;
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    // Rollback the transaction
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const UserService = {
  createUser,
};
