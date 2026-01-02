import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { authController } from '../controllers/authController';
import { LoginSchema, SignupSchema } from '@/validation/auth.schema';
import { authenticate } from '../middlewares/jwt';

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
