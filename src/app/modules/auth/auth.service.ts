/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';

import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';

import { User } from '../user/user.model';

import { createToken, verifyToken } from '../../../helper/tokenHelper';

// login user
const userLogin = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  // Check if the user exists
  const isUserExist = await User.isUserExist(email);
  if (!isUserExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Invalid email or password. Please check your credentials and try again.',
    );
  }

  // Match the password
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password.');
  }

  const user = await User.findOne({ email: isUserExist.email });

  // Create token payload
  const tokenPayload = {
    ...user,
  };

  const accessToken = createToken(
    tokenPayload,
    config.crypto.accessTokenSecret as any,
    config.crypto.accessTokenExpireIn as any,
  );

  const refreshToken = createToken(
    tokenPayload,
    config.crypto.refreshTokenSecret as string,
    config.crypto.refreshTokenExpireIn as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

// refresh Token
const getNewAccessToken = async (
  token: string,
): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;

  try {
    verifiedToken = verifyToken(
      token,
      config.crypto.refreshTokenSecret as string,
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { email } = verifiedToken;

  // Ensure user still exists
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const tokenPayload = {
    ...isUserExist,
  };

  const newAccessToken = createToken(
    tokenPayload,
    config.crypto.accessTokenSecret as string,
    config.crypto.accessTokenExpireIn as string,
  );

  return {
    accessToken: newAccessToken,
  };
};
export const AuthService = {
  userLogin,
  getNewAccessToken,
};
