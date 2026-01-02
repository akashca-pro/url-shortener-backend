import express from 'express';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { validateRequest } from '../middlewares/validateRequest';
import { UrlController } from '../controllers/urlController';
import { CreateUrlSchema, UrlIdParamSchema } from '@/validation/url.schema';
import { authenticate } from '../middlewares/jwt';

const urlController = container.get<UrlController>(TYPES.UrlController);

export const urlRouter = express.Router();

// Protected routes
urlRouter.post(
    '/shorten',
    authenticate,
    validateRequest(CreateUrlSchema),
    urlController.create
);

urlRouter.get(
    '/',
    authenticate,
    urlController.getAll
);

urlRouter.delete(
    '/:id',
    authenticate,
    validateRequest(UrlIdParamSchema, 'params'),
    urlController.delete
);
