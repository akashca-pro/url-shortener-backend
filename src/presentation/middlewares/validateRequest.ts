import { APP_ERRORS } from '@/const/errors.const';
import ResponseHandler from '@/utils/responseHandler';
import HTTP_STATUS from '@/utils/httpStatusCodes';
import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodRawShape } from 'zod';

type RequestPart = 'body' | 'query' | 'params';

export const validateRequest =
    (schema: ZodObject<ZodRawShape>, part: RequestPart = 'body') =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[part]);

        if (!result.success) {
            const formattedErrors = result.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));

            return ResponseHandler.error(
                res,
                APP_ERRORS.VALIDATION_ERROR,
                HTTP_STATUS.BAD_REQUEST,
                formattedErrors
            );
        }

        req.validated = {
            body: part === 'body' ? result.data : req.validated?.body,
            params: part === 'params' ? result.data : req.validated?.params,
            query: part === 'query' ? result.data : req.validated?.query,
        };

        next();
    };
