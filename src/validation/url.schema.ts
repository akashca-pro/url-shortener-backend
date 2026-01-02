import { z } from 'zod';

export const CreateUrlSchema = z.object({
    originalUrl: z
        .string()
        .url('Please provide a valid URL')
        .min(1, 'URL is required'),
    
    customCode: z
        .string()
        .min(4, 'Custom code must be at least 4 characters')
        .max(20, 'Custom code must be at most 20 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Custom code can only contain letters, numbers, underscores, and hyphens')
        .optional(),
});

export const ShortCodeParamSchema = z.object({
    shortCode: z
        .string()
        .min(1, 'Short code is required'),
});

export const UrlIdParamSchema = z.object({
    id: z
        .string()
        .min(1, 'URL ID is required')
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid URL ID format'),
});

export type CreateUrlInput = z.infer<typeof CreateUrlSchema>;
export type ShortCodeParam = z.infer<typeof ShortCodeParamSchema>;
export type UrlIdParam = z.infer<typeof UrlIdParamSchema>;
