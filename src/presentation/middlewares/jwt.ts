import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/logger';
import ResponseHandler from '@/utils/responseHandler';
import HTTP_STATUS from '@/utils/httpStatusCodes';
import { AUTH_ERRORS } from '@/const/errors.const';
import { APP_LABELS } from '@/const/labels.const';
import { ITokenPayload } from '@/types/token.type';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies[APP_LABELS.ACCESS_TOKEN];

    if (!token) {
        return ResponseHandler.error(
            res,
            AUTH_ERRORS.TOKEN_NOT_FOUND,
            HTTP_STATUS.UNAUTHORIZED
        );
    }

    try {
        const decoded = jwt.verify(
            token,
            config.JWT_ACCESS_TOKEN_SECRET
        ) as ITokenPayload;

        if (!decoded || !decoded.userId || !decoded.email) {
            return ResponseHandler.error(
                res,
                AUTH_ERRORS.INVALID_TOKEN_PAYLOAD,
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        req.userId = decoded.userId;
        req.name = decoded.name;
        req.email = decoded.email;

        next();
    } catch (error) {
        logger.error(AUTH_ERRORS.TOKEN_VERIFICATION_FAILED, error);
        return ResponseHandler.error(
            res,
            AUTH_ERRORS.INVALID_TOKEN_PAYLOAD,
            HTTP_STATUS.UNAUTHORIZED
        );
    }
};
