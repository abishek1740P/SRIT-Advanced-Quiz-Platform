const rateLimit = require("express-rate-limit");

const isProduction = process.env.NODE_ENV === "production";

// Environment-based configuration
const getLimitConfig = (productionLimit, developmentLimit) => {
  return isProduction ? productionLimit : developmentLimit;
};

// ==================== GENERAL RATE LIMITERS ====================

// Basic API rate limiter (for general endpoints)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: getLimitConfig(100, 1000), // 100 in production, 1000 in development
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== AUTH-SPECIFIC RATE LIMITERS ====================

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: getLimitConfig(5, 50), // 5 in production, 50 in development
  message: {
    success: false,
    message:
      "Too many authentication attempts, please try again after 15 minutes.",
  },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for registration endpoints
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: getLimitConfig(3, 20), // 3 in production, 20 in development
  message: {
    success: false,
    message:
      "Too many accounts created from this IP, please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== STRICT RATE LIMITERS ====================

// Very strict rate limiter for sensitive operations
const strictLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: getLimitConfig(10, 100), // 10 in production, 100 in development
  message: {
    success: false,
    message: "Too many requests, please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== AI-SPECIFIC RATE LIMITERS ====================

// Rate limiter for AI API endpoints (to control costs)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: getLimitConfig(10, 50), // 10 in production, 50 in development
  message: {
    success: false,
    message:
      "Too many AI requests, please wait a minute before making more requests.",
  },
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== QUIZ-SPECIFIC RATE LIMITERS ====================

// Rate limiter for quiz submissions
const quizSubmissionLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: getLimitConfig(3, 10), // 3 in production, 10 in development
  message: {
    success: false,
    message: "Too many quiz submissions, please wait a moment.",
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
    // Higher limits in development
    const baseLimit = getLimitConfig(100, 1000);

    if (req.user && req.user.role === "admin") {
      return getLimitConfig(1000, 5000); // Admin limit
    }
    if (req.user && req.user.role === "teacher") {
      return getLimitConfig(500, 2000); // Teacher limit
    }
    return baseLimit; // Student/regular user limit
  },
  message: {
    success: false,
    message: "Too many requests, please try again later.",
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
    if (req.user && req.user.role === "admin") {
      return 0; // 0 means no rate limiting
    }
    return getLimitConfig(100, 1000); // Regular users
  },
  skip: (req) => {
    // Skip rate limiting for admin users entirely
    return req.user && req.user.role === "admin";
  },
  message: {
    success: false,
    message: "Too many requests, please try again later.",
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
    message: "Development rate limit exceeded.",
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
    message: "Rate limit exceeded (this should not happen in testing).",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== ENVIRONMENT INFO ====================

const rateLimitInfo = {
  environment: isProduction ? "production" : "development",
  limits: {
    api: getLimitConfig(100, 1000),
    auth: getLimitConfig(5, 50),
    register: getLimitConfig(3, 20),
    ai: getLimitConfig(10, 50),
    quiz: getLimitConfig(3, 10),
  },
};

console.log("🔒 Rate limiting configured for:", rateLimitInfo.environment);
console.log("📊 Rate limits:", rateLimitInfo.limits);

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

  // Environment info (useful for debugging)
  rateLimitInfo,

  // Helper function to create custom rate limiters
  createCustomLimiter: (options = {}) => {
    const defaults = {
      windowMs: 15 * 60 * 1000,
      max: getLimitConfig(100, 1000),
      message: {
        success: false,
        message: "Too many requests, please try again later.",
      },
      standardHeaders: true,
      legacyHeaders: false,
    };

    return rateLimit({ ...defaults, ...options });
  },

  // Utility function to check current environment limits
  getCurrentLimits: () => rateLimitInfo,
};
