import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import salesRoutes from "./routes/salesRoutes.js";
import logger from "./config/logger.js";

// Load environment variables
dotenv.config();

const app = express();

// ----- Security Middleware -----
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(rateLimiter);

// ----- Body Parsers -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----- Swagger API Docs -----
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ----- API Routes -----
app.use("/api", salesRoutes);

// ----- Health Check -----
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ----- Global Error Handler -----
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    logger.error("Unhandled error:", { error: err.message, stack: err.stack });
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
);

export default app;
