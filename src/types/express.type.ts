import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            email?: string;
            name?: string;
            validated?: {
                body?: any;
                params?: any;
                query?: any;
            };
        }
    }
}

export interface AuthenticatedRequest extends Request {
    userId: string;
    email: string;
    name: string;
}
