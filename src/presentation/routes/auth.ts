import express from 'express';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { validateRequest } from '../middlewares/validateRequest';
import { AuthController } from '../controllers/authController';
import { LoginSchema, SignupSchema } from '@/validation/auth.schema';
import { authenticate } from '../middlewares/jwt';

const authController = container.get<AuthController>(TYPES.AuthController);

export const authRouter = express.Router();

authRouter.post(
    '/signup',
    validateRequest(SignupSchema),
    authController.signup
);

authRouter.post(
    '/login',
    validateRequest(LoginSchema),
    authController.login
);

authRouter.delete(
    '/logout',
    authenticate,
    authController.logout
);
