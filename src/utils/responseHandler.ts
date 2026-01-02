import { Response } from 'express';
import HTTP_STATUS from '@/utils/httpStatusCodes';

class ResponseHandler {
    static success(
        res: Response,
        message: string = 'Success',
        statusCode: number = HTTP_STATUS.OK,
        data: any = null
    ) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    static error(
        res: Response,
        message: string = 'Something went wrong',
        statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error: any = null
    ) {
        return res.status(statusCode).json({
            success: false,
            message,
            error: error?.message || error,
        });
    }

    static redirect(res: Response, url: string) {
        return res.redirect(HTTP_STATUS.FOUND, url);
    }
}

export default ResponseHandler;
