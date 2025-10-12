const rateLimit = require('express-rate-limit');

// ==================== GENERAL RATE LIMITERS ====================

// Basic API rate limiter (for general endpoints)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// ==================== AUTH-SPECIFIC RATE LIMITERS ====================

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.'
  },
  skipSuccessfulRequests: true, // Don't count successful requests (successful logins)
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for registration endpoints
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 account creations per hour
  message: {
    success: false,
    message: 'Too many accounts created from this IP, please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== STRICT RATE LIMITERS ====================

// Very strict rate limiter for sensitive operations
const strictLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 requests per 5 minutes
  message: {
    success: false,
    message: 'Too many requests, please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== AI-SPECIFIC RATE LIMITERS ====================

// Rate limiter for AI API endpoints (to control costs)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each user to 10 AI requests per minute
  message: {
    success: false,
    message: 'Too many AI requests, please wait a minute before making more requests.'
  },
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise use IP
    return req.user ? req.user.id : req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== QUIZ-SPECIFIC RATE LIMITERS ====================

// Rate limiter for quiz submissions
const quizSubmissionLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 3, // Limit each user to 3 quiz submissions per 30 seconds
  message: {
    success: false,
    message: 'Too many quiz submissions, please wait a moment.'
  },
  keyGenerator: (req) => {
    return req.user ? `quiz_${req.user.id}` : req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== ADMIN/UNLIMITED RATE LIMITERS ====================

// Rate limiter that skips for admin users
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req) => {
    // Admins get higher limits
    if (req.user && req.user.role === 'admin') {
      return 1000; // Admin limit
    }
    if (req.user && req.user.role === 'teacher') {
      return 500; // Teacher limit
    }
    return 100; // Student/regular user limit
  },
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Skip rate limiting for certain conditions
const skipRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req) => {
    // Skip rate limiting for admin users
    if (req.user && req.user.role === 'admin') {
      return 0; // 0 means no rate limiting
    }
    return 100; // Regular users
  },
  skip: (req) => {
    // Skip rate limiting for admin users entirely
    return req.user && req.user.role === 'admin';
  },
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== DEVELOPMENT/TESTING RATE LIMITERS ====================

// Development rate limiter (more lenient)
const devLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // Very high limit for development
  message: {
    success: false,
    message: 'Development rate limit exceeded.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Disabled rate limiter for testing
const disabledLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000000, // Essentially disabled
  message: {
    success: false,
    message: 'Rate limit exceeded (this should not happen in testing).'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== EXPORTS ====================

module.exports = {
  // General limiters
  apiLimiter,
  strictLimiter,
  userLimiter,
  skipRateLimit,
  
  // Auth limiters
  authLimiter,
  registerLimiter,
  
  // Feature-specific limiters
  aiLimiter,
  quizSubmissionLimiter,
  
  // Development limiters
  devLimiter,
  disabledLimiter,
  
  // Helper function to create custom rate limiters
  createCustomLimiter: (options = {}) => {
    const defaults = {
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: {
        success: false,
        message: 'Too many requests, please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    };
    
    return rateLimit({ ...defaults, ...options });
  }
};