import { Response, CookieOptions } from 'express';

export const getCookieOptions = (): CookieOptions => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
});

export const setCookie = (
    res: Response,
    name: string,
    value: string,
    maxAgeMs: number = 1 * 24 * 60 * 60 * 1000 // 1 day default
) => {
    res.cookie(name, value, {
        ...getCookieOptions(),
        maxAge: maxAgeMs,
    });
};

export const clearCookie = (res: Response, name: string) => {
    res.cookie(name, '', {
        ...getCookieOptions(),
        maxAge: 0,
    });
};
