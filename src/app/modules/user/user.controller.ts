import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { IUser } from '../user/user.interface';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { UserService } from './user.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user created successfully !',
    data: result,
  });
});

export const UserController = {
  createUser,
};
