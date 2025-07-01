import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IRefreshTokenResponse } from './auth.interface';
import { AuthService } from './auth.service';

// userLogin
const userLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.userLogin(req.body);

  // Set refresh token in cookie
  res.cookie('refreshToken', result?.refreshToken, {
    secure: config.env === 'production',
    httpOnly: false,
  });

  // Send response
  sendResponse<{ accessToken: string }>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: {
      accessToken: result?.accessToken,
    },
  });
});

// refreshToken
const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.getNewAccessToken(refreshToken);

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});

// const handleGoogleLogin = async (req: Request, res: Response) => {
//   const user = req.user as JwtPayload;

//   const accessTokenPayload = {
//     userId: user._id,
//     role: user.role,
//     email: user.email,
//     accountType:user
//   };

//   if (user.role === 'customer') {
//     accessTokenPayload.accountType = user.accountType;
//   }

//   const accessToken = jwtHelpers.createToken(
//     accessTokenPayload,
//     process.env.JWT_ACCESS_TOKEN_SECRET as string,
//     process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string,
//   );

//   const refreshToken = jwtHelpers.createToken(
//     accessTokenPayload,
//     process.env.JWT_REFRESH_TOKEN_SECRET as string,
//     process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string,
//   );

//   res.cookie('refreshToken', refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'eventsion',
//   });

//   const result: ILoginUserResponse = {
//     token: {
//       accessToken: accessToken,
//       isEmailVerified: user.isEmailVerified,
//     },
//     user: user,
//   };

//   sendResponse<ILoginUserResponse>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'User logged in successfully!',
//     data: result,
//   });
// };

export const AuthController = {
  userLogin,
  getNewAccessToken,
};
