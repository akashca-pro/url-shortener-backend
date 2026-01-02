import { NextFunction, Request, Response } from 'express';
import { urlService } from '@/services/url.service';
import { URL_SUCCESS } from '@/const/success.const';
import { URL_ERRORS } from '@/const/errors.const';
import HTTP_STATUS from '@/utils/httpStatusCodes';
import ResponseHandler from '@/utils/responseHandler';
import logger from '@/utils/logger';

export const urlController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info('Create short URL request received');
            const input = req.validated?.body;
            const userId = req.userId!;

            const response = await urlService.createShortUrl(userId, input);

            if (!response.success) {
                logger.error({ error: response.errorMessage }, 'Create URL failed');
                return ResponseHandler.error(
                    res,
                    response.errorMessage || 'Failed to create short URL',
                    response.errorMessage === URL_ERRORS.URL_ALREADY_EXISTS
                        ? HTTP_STATUS.CONFLICT
                        : HTTP_STATUS.BAD_REQUEST
                );
            }

            logger.info('Short URL created successfully');

            return ResponseHandler.success(
                res,
                URL_SUCCESS.URL_CREATED,
                HTTP_STATUS.CREATED,
                response.data
            );
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },

    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info('Get all URLs request received');
            const userId = req.userId!;

            const response = await urlService.getUserUrls(userId);

            if (!response.success) {
                logger.error({ error: response.errorMessage }, 'Get URLs failed');
                return ResponseHandler.error(
                    res,
                    response.errorMessage || 'Failed to get URLs',
                    HTTP_STATUS.BAD_REQUEST
                );
            }

            return ResponseHandler.success(
                res,
                URL_SUCCESS.URLS_FETCHED,
                HTTP_STATUS.OK,
                response.data
            );
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info('Delete URL request received');
            const urlId = req.validated?.params?.id;
            const userId = req.userId!;

            const response = await urlService.deleteUrl(userId, urlId);

            if (!response.success) {
                logger.error({ error: response.errorMessage }, 'Delete URL failed');
                return ResponseHandler.error(
                    res,
                    response.errorMessage || 'Failed to delete URL',
                    response.errorMessage === URL_ERRORS.UNAUTHORIZED_URL_ACCESS
                        ? HTTP_STATUS.FORBIDDEN
                        : HTTP_STATUS.NOT_FOUND
                );
            }

            return ResponseHandler.success(
                res,
                URL_SUCCESS.URL_DELETED,
                HTTP_STATUS.OK
            );
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },

    redirect: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { shortCode } = req.params;
            logger.info({ shortCode }, 'Redirect request received');

            const response = await urlService.getOriginalUrl(shortCode);

            if (!response.success || !response.data) {
                logger.error({ error: response.errorMessage }, 'URL not found');
                return ResponseHandler.error(
                    res,
                    URL_ERRORS.URL_NOT_FOUND,
                    HTTP_STATUS.NOT_FOUND
                );
            }

            logger.info({ shortCode, originalUrl: response.data }, 'Redirecting');

            return ResponseHandler.redirect(res, response.data);
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },
};
