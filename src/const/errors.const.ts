export const AUTH_ERRORS = {
    USER_ALREADY_EXISTS: 'User with this email already exists',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCESS_TOKEN_ISSUE_ERROR: 'Failed to generate access token',
    TOKEN_NOT_FOUND: 'Access token not found',
    INVALID_TOKEN_PAYLOAD: 'Invalid token payload',
    TOKEN_VERIFICATION_FAILED: 'Token verification failed',
    UNAUTHORIZED: 'Unauthorized access',
};

export const URL_ERRORS = {
    URL_NOT_FOUND: 'URL not found',
    INVALID_URL: 'Invalid URL format',
    URL_CREATION_FAILED: 'Failed to create short URL',
    URL_ALREADY_EXISTS: 'Short code already exists',
    UNAUTHORIZED_URL_ACCESS: 'You are not authorized to access this URL',
};

export const APP_ERRORS = {
    VALIDATION_ERROR: 'Validation error',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    RESOURCE_NOT_FOUND: 'Resource not found',
};
