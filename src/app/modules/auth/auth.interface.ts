export type ILoginUser = {
  email: string;
  password: string;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken: string;
};

export type IDataValidationResponse = {
  validationResponse: {
    message?: string;
  };
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type IChangeEmail = {
  password: string;
  email: string;
};

export type IForgetPassword = {
  email: string;
};

export type IResetPassword = {
  otp: string;
  email: string;
  newPassword: string;
};

export type IAuthMessage = {
  message: string;
};
