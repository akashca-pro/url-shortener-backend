import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { urlController } from '../controllers/urlController';
import { CreateUrlSchema, UrlIdParamSchema } from '@/validation/url.schema';
import { authenticate } from '../middlewares/jwt';

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
