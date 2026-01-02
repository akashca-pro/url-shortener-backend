import express from 'express';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { validateRequest } from '../middlewares/validateRequest';
import { UrlController } from '../controllers/urlController';
import { CreateUrlSchema, UrlIdParamSchema } from '@/validation/url.schema';
import { authenticate } from '../middlewares/jwt';

const urlController = container.get<UrlController>(TYPES.UrlController);

export const urlRouter = express.Router();

/**
 * @swagger
 * /api/v1/urls/shorten:
 *   post:
 *     summary: Create a shortened URL
 *     tags: [URLs]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUrlRequest'
 *     responses:
 *       201:
 *         description: URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UrlItem'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Custom code already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
urlRouter.post(
    '/shorten',
    authenticate,
    validateRequest(CreateUrlSchema),
    urlController.create
);

/**
 * @swagger
 * /api/v1/urls:
 *   get:
 *     summary: Get all URLs for the authenticated user
 *     tags: [URLs]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: URLs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         urls:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/UrlItem'
 *                         total:
 *                           type: integer
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
urlRouter.get(
    '/',
    authenticate,
    urlController.getAll
);

/**
 * @swagger
 * /api/v1/urls/{id}:
 *   delete:
 *     summary: Delete a URL by ID
 *     tags: [URLs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the URL
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: URL deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Not authorized to delete this URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: URL not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
urlRouter.delete(
    '/:id',
    authenticate,
    validateRequest(UrlIdParamSchema, 'params'),
    urlController.delete
);

/**
 * @swagger
 * /{shortCode}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [Redirect]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The short code of the URL
 *         example: abc123
 *     responses:
 *       302:
 *         description: Redirects to the original URL
 *       404:
 *         description: URL not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
