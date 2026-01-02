import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '@/config';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'URL Shortener API',
            version: '1.0.0',
            description: 'A RESTful API for URL shortening with authentication',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: config.BASE_URL,
                description: 'Current server',
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'accessToken',
                    description: 'JWT token stored in httpOnly cookie',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                    },
                },
                SignupRequest: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: { type: 'string', minLength: 2, maxLength: 50, example: 'John Doe' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        password: { type: 'string', minLength: 8, example: 'Password123!' },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        password: { type: 'string', example: 'Password123!' },
                    },
                },
                CreateUrlRequest: {
                    type: 'object',
                    required: ['originalUrl'],
                    properties: {
                        originalUrl: { type: 'string', format: 'uri', example: 'https://example.com/very-long-url' },
                        customCode: { type: 'string', minLength: 4, maxLength: 20, example: 'my-link' },
                    },
                },
                UrlItem: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                        originalUrl: { type: 'string', example: 'https://example.com/very-long-url' },
                        shortCode: { type: 'string', example: 'abc123' },
                        shortUrl: { type: 'string', example: 'http://localhost:9000/abc123' },
                        clickCount: { type: 'integer', example: 42 },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string' },
                        data: { type: 'object' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./src/presentation/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
