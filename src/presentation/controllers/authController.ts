import { injectable, inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { TYPES } from '@/di/types';
import { IAuthService } from '@/services/interfaces/auth.service.interface';
import { AUTH_SUCCESS } from '@/const/success.const';
import { AUTH_ERRORS } from '@/const/errors.const';
import HTTP_STATUS from '@/utils/httpStatusCodes';
import ResponseHandler from '@/utils/responseHandler';
import { setCookie, clearCookie } from '@/utils/cookie';
import { APP_LABELS } from '@/const/labels.const';
import logger from '@/utils/logger';

// 1 day in milliseconds
const TOKEN_EXPIRY_MS = 1 * 24 * 60 * 60 * 1000;

@injectable()
export class AuthController {
    readonly #authService: IAuthService;

    constructor(
        @inject(TYPES.IAuthService) authService: IAuthService
    ) {
        this.#authService = authService;
    }

    signup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info('Signup request received');
            const input = req.validated?.body;

            const response = await this.#authService.signup(input);

            if (!response.success) {
                logger.error({ error: response.errorMessage }, 'Signup failed');
                return ResponseHandler.error(
                    res,
                    response.errorMessage || 'Signup failed',
                    response.errorMessage === AUTH_ERRORS.USER_ALREADY_EXISTS
                        ? HTTP_STATUS.CONFLICT
                        : HTTP_STATUS.BAD_REQUEST
                );
            }

            logger.info({ email: input.email }, 'Signup successful');

            // Set cookie
            setCookie(
                res,
                APP_LABELS.ACCESS_TOKEN,
                response.data!.accessToken,
                TOKEN_EXPIRY_MS
            );

            return ResponseHandler.success(
                res,
                AUTH_SUCCESS.USER_CREATED,
                HTTP_STATUS.CREATED,
                response.data?.user
            );
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info('Login request received');
            const input = req.validated?.body;

            const response = await this.#authService.login(input);

            if (!response.success) {
                logger.error({ error: response.errorMessage }, 'Login failed');
                return ResponseHandler.error(
                    res,
                    response.errorMessage || 'Login failed',
                    HTTP_STATUS.UNAUTHORIZED
                );
            }

            logger.info({ email: input.email }, 'Login successful');

            setCookie(
                res,
                APP_LABELS.ACCESS_TOKEN,
                response.data!.accessToken,
                TOKEN_EXPIRY_MS
            );

            return ResponseHandler.success(
                res,
                AUTH_SUCCESS.LOGIN_SUCCESSFUL,
                HTTP_STATUS.OK,
                response.data?.user
            );
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info('Logout request received');

            clearCookie(res, APP_LABELS.ACCESS_TOKEN);

            return ResponseHandler.success(
                res,
                AUTH_SUCCESS.LOGOUT_SUCCESSFUL,
                HTTP_STATUS.OK
            );
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
}
