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
    PORT: Number(process.env.PORT)!,
    SERVICE_NAME: process.env.SERVICE_NAME!,
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
    JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY!,
    CLIENT_URL: process.env.CLIENT_URL!,
    BASE_URL: process.env.BASE_URL!,
};
