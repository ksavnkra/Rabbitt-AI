import rateLimit from "express-rate-limit";

/**
 * Rate limiter middleware.
 * Limits each IP to 5 requests per 60-second window.
 */
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message:
      "Too many requests from this IP. Please try again after 1 minute.",
  },
});
