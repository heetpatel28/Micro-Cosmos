import rateLimit from 'express-rate-limit';

export const generationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 generation requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many generation requests, please try again later.',
    },
});

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit login attempts
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many login attempts, please try again later.',
    },
});
