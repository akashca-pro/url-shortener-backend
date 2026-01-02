import { customAlphabet } from 'nanoid';

// Use URL-safe characters for short codes
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 8);

/**
 * Generate a unique short code for URLs
 * Uses nanoid with URL-safe alphabet
 */
export const generateShortCode = (): string => {
    return nanoid();
};

/**
 * Validate if a short code is valid
 */
export const isValidShortCode = (code: string): boolean => {
    const pattern = /^[a-zA-Z0-9_-]+$/;
    return pattern.test(code) && code.length >= 4 && code.length <= 20;
};
