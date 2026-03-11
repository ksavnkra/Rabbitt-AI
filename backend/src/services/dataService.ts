import { Readable } from "stream";
import csvParser from "csv-parser";
import * as XLSX from "xlsx";
import path from "path";
import logger from "../config/logger.js";

/**
 * Represents a single row from the sales dataset.
 */
export interface SalesRow {
  Date: string;
  Product_Category: string;
  Region: string;
  Units_Sold: number;
  Unit_Price: number;
  Revenue: number;
  Status: string;
}

/**
 * Extracted metrics from the sales dataset.
 */
export interface SalesMetrics {
  totalRevenue: number;
  totalUnitsSold: number;
  bestPerformingRegion: string;
  bestPerformingCategory: string;
  cancelledOrders: number;
  totalOrders: number;
  regionBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
}

/**
 * Parse a CSV buffer into an array of row objects.
 */
function parseCSV(buffer: Buffer): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const results: Record<string, string>[] = [];
    const stream = Readable.from(buffer);

    stream
      .pipe(csvParser())
      .on("data", (row: Record<string, string>) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", (err: Error) => reject(err));
  });
}

/**
 * Parse an XLSX buffer into an array of row objects.
 */
function parseXLSX(buffer: Buffer): Record<string, string>[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error("The uploaded Excel file has no sheets.");
  }

  const worksheet = workbook.Sheets[firstSheetName];
  if (!worksheet) {
    throw new Error("Could not read the first sheet of the Excel file.");
  }

  return XLSX.utils.sheet_to_json<Record<string, string>>(worksheet);
}

/**
 * Normalize raw row data into typed SalesRow objects.
 */
function normalizeRows(rawRows: Record<string, string>[]): SalesRow[] {
  return rawRows.map((row) => ({
    Date: row["Date"] || "",
    Product_Category: row["Product_Category"] || "",
    Region: row["Region"] || "",
    Units_Sold: parseFloat(row["Units_Sold"] || "0") || 0,
    Unit_Price: parseFloat(row["Unit_Price"] || "0") || 0,
    Revenue: parseFloat(row["Revenue"] || "0") || 0,
    Status: row["Status"] || "",
  }));
}

/**
 * Extract business metrics from parsed sales rows.
 */
function extractMetrics(rows: SalesRow[]): SalesMetrics {
  let totalRevenue = 0;
  let totalUnitsSold = 0;
  let cancelledOrders = 0;
  const regionRevenue: Record<string, number> = {};
  const categoryRevenue: Record<string, number> = {};

  for (const row of rows) {
    totalRevenue += row.Revenue;
    totalUnitsSold += row.Units_Sold;

    if (row.Status.toLowerCase() === "cancelled") {
      cancelledOrders++;
    }

    regionRevenue[row.Region] = (regionRevenue[row.Region] || 0) + row.Revenue;
    categoryRevenue[row.Product_Category] =
      (categoryRevenue[row.Product_Category] || 0) + row.Revenue;
  }

  // Find best performing region & category by revenue
  const bestPerformingRegion =
    Object.entries(regionRevenue).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

  const bestPerformingCategory =
    Object.entries(categoryRevenue).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalUnitsSold,
    bestPerformingRegion,
    bestPerformingCategory,
    cancelledOrders,
    totalOrders: rows.length,
    regionBreakdown: regionRevenue,
    categoryBreakdown: categoryRevenue,
  };
}

/**
 * Parse an uploaded file (CSV or XLSX) and extract sales metrics.
 */
export async function parseFile(
  file: Express.Multer.File
): Promise<SalesMetrics> {
  const ext = path.extname(file.originalname).toLowerCase();
  let rawRows: Record<string, string>[];

  logger.info(`Parsing file: ${file.originalname} (${ext}, ${file.size} bytes)`);

  if (ext === ".csv") {
    rawRows = await parseCSV(file.buffer);
  } else if (ext === ".xlsx") {
    rawRows = parseXLSX(file.buffer);
  } else {
    throw new Error(`Unsupported file format: ${ext}`);
  }

  if (rawRows.length === 0) {
    throw new Error("The uploaded file contains no data rows.");
  }

  const rows = normalizeRows(rawRows);
  const metrics = extractMetrics(rows);

  logger.info("File parsed successfully", {
    rows: rows.length,
    totalRevenue: metrics.totalRevenue,
    totalUnitsSold: metrics.totalUnitsSold,
  });

  return metrics;
}
