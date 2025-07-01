import z from 'zod';

// user login validation schema
const userLoginZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

// refresh Token Zod Schema
const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

export const authValidationSchema = {
  userLoginZodSchema,
  refreshTokenZodSchema,
};
