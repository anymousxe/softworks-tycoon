import DOMPurify from 'dompurify';

// XSS Prevention - Sanitize HTML
export const sanitizeHTML = (dirty) => {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
        ALLOWED_ATTR: ['href']
    });
};

// Input validation and sanitization
export const validateInput = (input, maxLength = 100) => {
    if (!input || typeof input !== 'string') return '';

    const trimmed = input.trim();
    if (trimmed.length === 0) return '';
    if (trimmed.length > maxLength) return trimmed.substring(0, maxLength);

    // Remove dangerous characters
    return sanitizeHTML(trimmed);
};

// Rate limiting store (client-side)
const rateLimitStore = new Map();

export const checkRateLimit = (key, limit = 100, windowMs = 60000) => {
    const now = Date.now();
    const record = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };

    // Reset if window expired
    if (now > record.resetTime) {
        record.count = 0;
        record.resetTime = now + windowMs;
    }

    // Check limit
    if (record.count >= limit) {
        return false; // Rate limited
    }

    record.count++;
    rateLimitStore.set(key, record);
    return true; // Allowed
};

// CSRF token generation
export const generateCSRFToken = () => {
    return crypto.randomUUID();
};

// Validate CSRF token
export const validateCSRFToken = (token, storedToken) => {
    return token === storedToken;
};

// Secure data validation
export const validateGameData = (data) => {
    if (!data || typeof data !== 'object') return false;

    // Basic structure validation
    const requiredFields = ['name', 'cash', 'week', 'year'];
    return requiredFields.every(field => field in data);
};
