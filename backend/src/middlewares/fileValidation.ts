import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import logger from "../config/logger.js";

const ALLOWED_MIMETYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/octet-stream", // Some systems send XLSX as octet-stream
];

const ALLOWED_EXTENSIONS = [".csv", ".xlsx"];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Multer file filter — only allow CSV and XLSX files.
 */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    logger.warn(`Rejected file upload: invalid extension "${ext}"`, {
      filename: file.originalname,
    });
    cb(new Error("Invalid file type. Only CSV and XLSX files are allowed."));
    return;
  }

  // For .csv files, allow broader mime types (text/csv, application/vnd.ms-excel)
  // For .xlsx files, allow spreadsheet mime types and octet-stream
  if (ext === ".csv") {
    if (
      !["text/csv", "application/vnd.ms-excel", "application/octet-stream"].includes(
        file.mimetype
      )
    ) {
      logger.warn(`Rejected file upload: invalid mimetype "${file.mimetype}" for CSV`, {
        filename: file.originalname,
      });
      cb(new Error("Invalid file type. Only CSV and XLSX files are allowed."));
      return;
    }
  } else if (ext === ".xlsx") {
    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
      logger.warn(
        `Rejected file upload: invalid mimetype "${file.mimetype}" for XLSX`,
        { filename: file.originalname }
      );
      cb(new Error("Invalid file type. Only CSV and XLSX files are allowed."));
      return;
    }
  }

  cb(null, true);
};

/**
 * Multer upload middleware configured with memory storage,
 * 5MB size limit, and CSV/XLSX-only file filter.
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});
