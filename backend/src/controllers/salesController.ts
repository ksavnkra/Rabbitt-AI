import { Request, Response } from "express";
import { parseFile } from "../services/dataService.js";
import { generateSummary } from "../services/aiService.js";
import { sendEmail } from "../services/emailService.js";
import logger from "../config/logger.js";

/**
 * POST /api/analyze-sales
 *
 * Orchestrates the full pipeline:
 *  1. Validate file + email
 *  2. Parse sales data → extract metrics
 *  3. Generate AI executive summary
 *  4. Email the summary
 *  5. Return { status, summary }
 */
export async function analyzeSales(
  req: Request,
  res: Response
): Promise<void> {
  try {
    logger.info("Request received: POST /api/analyze-sales");

    // --- 1. Validate inputs ---
    const file = req.file;
    if (!file) {
      res.status(400).json({
        status: "error",
        message: "No file uploaded. Please upload a CSV or XLSX file.",
      });
      return;
    }

    const email = req.body.email as string | undefined;
    if (!email || !email.trim()) {
      res.status(400).json({
        status: "error",
        message: 'Missing "email" field. Please provide a valid email address.',
      });
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({
        status: "error",
        message: "Invalid email format. Please provide a valid email address.",
      });
      return;
    }

    // --- 2. Parse file & extract metrics ---
    const metrics = await parseFile(file);

    // --- 3. Generate AI summary ---
    const summary = await generateSummary(metrics);
    logger.info("AI summary generated");

    // --- 4. Email the summary ---
    await sendEmail(email.trim(), summary);
    logger.info("Email sent");

    // --- 5. Return response ---
    res.status(200).json({
      status: "success",
      summary,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    logger.error("Error in analyzeSales:", { error: message });

    res.status(500).json({
      status: "error",
      message,
    });
  }
}
