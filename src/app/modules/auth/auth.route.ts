import express from 'express';
import validateRequest from '../../middlewares/ValidateRequest';
import { authValidationSchema } from './auth.validation';
import { AuthController } from './auth.controller';
import { UserController } from '../user/user.controller';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidationSchema.userLoginZodSchema),
  AuthController.userLogin,
);

router.post(
  '/register',
  UserController.createUser,
);

router.post(
  '/get-new-accessToken',
  validateRequest(authValidationSchema.refreshTokenZodSchema),
  AuthController.getNewAccessToken,
);

export const AuthRoutes = router;
