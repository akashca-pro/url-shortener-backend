import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import '@/types/express.type';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { config } from '@/config';
import { connectDB } from '@/config/db';
import { swaggerSpec } from '@/config/swagger';
import logger from '@/utils/logger';
import { globalErrorHandler, notFound } from '@/utils/errorHandlers';
import { authRouter } from '@/presentation/routes/auth';
import { urlRouter } from '@/presentation/routes/urls';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { UrlController } from '@/presentation/controllers/urlController';

const app = express();

// Get URL controller from container for redirect route
const urlController = container.get<UrlController>(TYPES.UrlController);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.use(
    cors({
        origin: config.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Set-Cookie'],
    })
);

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'URL Shortener API Documentation',
}));

// Swagger JSON endpoint for download
app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="swagger.json"');
    res.json(swaggerSpec);
});

app.get('/:shortCode', urlController.redirect);

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/urls', urlRouter);

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(globalErrorHandler);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(config.PORT, () => {
            logger.info(
                `${config.SERVICE_NAME} running on port ${config.PORT}`
            );
            logger.info(`API Docs available at ${config.BASE_URL}/api/docs`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
