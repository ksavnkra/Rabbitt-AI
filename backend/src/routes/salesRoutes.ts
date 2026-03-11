import { Router, Request, Response, NextFunction } from "express";
import { upload } from "../middlewares/fileValidation.js";
import { analyzeSales } from "../controllers/salesController.js";
import multer from "multer";

const router = Router();

/**
 * POST /analyze-sales
 *
 * Upload a CSV or XLSX file with sales data and provide an email.
 * The API parses the data, generates an AI summary, and sends it via email.
 */
router.post(
  "/analyze-sales",
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("file")(req, res, (err: unknown) => {
      if (err) {
        // Handle Multer-specific errors (file too large, invalid type, etc.)
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            res.status(400).json({
              status: "error",
              message: "File too large. Maximum file size is 5MB.",
            });
            return;
          }
          res.status(400).json({
            status: "error",
            message: err.message,
          });
          return;
        }

        // Handle custom file filter errors
        if (err instanceof Error) {
          res.status(400).json({
            status: "error",
            message: err.message,
          });
          return;
        }

        res.status(500).json({
          status: "error",
          message: "An unexpected error occurred during file upload.",
        });
        return;
      }
      next();
    });
  },
  analyzeSales
);

export default router;
