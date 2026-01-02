import dotenv from 'dotenv';
dotenv.config();

interface Config {
    PORT: number;
    SERVICE_NAME: string;
    DATABASE_URL: string;
    JWT_ACCESS_TOKEN_SECRET: string;
    JWT_ACCESS_TOKEN_EXPIRY: string;
    CLIENT_URL: string;
    BASE_URL: string;
}

export const config: Config = {
    PORT: Number(process.env.PORT) || 9000,
    SERVICE_NAME: process.env.SERVICE_NAME || 'url-shortener-backend',
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/url-shortener',
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || 'default-secret-change-me',
    JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY || '7d',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    BASE_URL: process.env.BASE_URL || 'http://localhost:9000',
};
