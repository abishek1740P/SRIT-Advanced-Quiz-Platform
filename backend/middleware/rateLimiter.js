const rateLimit = require("express-rate-limit");

const isProduction = process.env.NODE_ENV === "production";

// Environment-based configuration - Much more generous limits
const getLimitConfig = (productionLimit, developmentLimit) => {
  return isProduction ? productionLimit : developmentLimit;
};

// ==================== GENERAL RATE LIMITERS ====================

// Basic API rate limiter (for general endpoints)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: getLimitConfig(300, 5000), // Increased: 300 in production, 5000 in development
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== AUTH-SPECIFIC RATE LIMITERS ====================

// Rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: getLimitConfig(15, 200), // Increased: 15 in production, 200 in development
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  skipSuccessfulRequests: true, // Only count failed attempts
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for registration endpoints
const registerLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours (instead of 1 hour)
  max: getLimitConfig(10, 100), // Increased: 10 in production, 100 in development
  message: {
    success: false,
    message:
      "Too many accounts created from this IP, please try again tomorrow.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== STRICT RATE LIMITERS ====================

// Sensitive operations rate limiter
const sensitiveLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: getLimitConfig(30, 300), // Increased: 30 in production, 300 in development
  message: {
    success: false,
    message: "Too many requests, please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== AI-SPECIFIC RATE LIMITERS ====================

// Rate limiter for AI API endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: getLimitConfig(30, 150), // Increased: 30 in production, 150 in development
  message: {
    success: false,
    message: "AI service is busy, please wait a moment before trying again.",
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
  max: getLimitConfig(10, 50), // Increased: 10 in production, 50 in development
  message: {
    success: false,
    message: "Please wait a moment before submitting another quiz.",
  },
  keyGenerator: (req) => {
    return req.user ? `quiz_${req.user.id}` : req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== USER TIERED RATE LIMITERS ====================

// User-specific rate limiter with tiered limits
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    if (req.user && req.user.role === "admin") {
      return getLimitConfig(5000, 20000); // Very high for admins
    }
    if (req.user && req.user.role === "teacher") {
      return getLimitConfig(1000, 5000); // High for teachers
    }
    if (req.user && req.user.role === "premium") {
      return getLimitConfig(500, 2000); // Good for premium users
    }
    return getLimitConfig(300, 1000); // Base for regular users
  },
  message: {
    success: false,
    message: "Rate limit exceeded. Please try again in 15 minutes.",
  },
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== PUBLIC API LIMITER ====================

// For public APIs that might be called frequently
const publicApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: getLimitConfig(60, 300), // 1 request per second in production
  message: {
    success: false,
    message: "Rate limit exceeded. Please limit requests to 1 per second.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== DEVELOPMENT/TESTING ====================

// Very generous development limiter
const devLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10000, // Extremely high for development
  message: {
    success: false,
    message: "Development rate limit exceeded.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== ENVIRONMENT INFO ====================

const rateLimitInfo = {
  environment: isProduction ? "production" : "development",
  limits: {
    api: getLimitConfig(300, 5000),
    auth: getLimitConfig(15, 200),
    register: getLimitConfig(10, 100),
    ai: getLimitConfig(30, 150),
    quiz: getLimitConfig(10, 50),
    publicApi: getLimitConfig(60, 300),
  },
  messages: {
    note: "Rate limits are per IP address unless user is authenticated",
    authentication: "Authenticated users get higher limits based on role",
    development: "Development environment has much higher limits for testing",
  },
};

console.log("🔓 Rate limiting configured for:", rateLimitInfo.environment);
console.log("📈 Rate limits:", rateLimitInfo.limits);
console.log("💡 Note: These are reasonable limits for most applications");

// ==================== EXPORTS ====================

module.exports = {
  // General limiters
  apiLimiter,
  sensitiveLimiter,
  userLimiter,
  publicApiLimiter,

  // Auth limiters
  authLimiter,
  registerLimiter,

  // Feature-specific limiters
  aiLimiter,
  quizSubmissionLimiter,

  // Development limiter
  devLimiter,

  // Helper function to create custom rate limiters
  createCustomLimiter: (options = {}) => {
    const defaults = {
      windowMs: 15 * 60 * 1000,
      max: getLimitConfig(100, 1000),
      message: {
        success: false,
        message: "Rate limit exceeded. Please try again later.",
      },
      standardHeaders: true,
      legacyHeaders: false,
    };

    return rateLimit({ ...defaults, ...options });
  },

  // Utility to check current environment limits
  getCurrentLimits: () => rateLimitInfo,

  // Helper to determine if we're in development
  isDevelopment: !isProduction,
};
