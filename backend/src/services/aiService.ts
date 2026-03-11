import Groq from "groq-sdk";
import logger from "../config/logger.js";
import type { SalesMetrics } from "./dataService.js";

/**
 * Generate an executive sales summary using Groq (Llama 3).
 */
export async function generateSummary(
  metrics: SalesMetrics
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured. Please set it in your .env file."
    );
  }

  const groq = new Groq({ apiKey });

  // Build a structured prompt with the extracted metrics
  const prompt = `Create a concise executive sales report using the following metrics and insights. The tone should be professional and suitable for company leadership.

## Sales Data Metrics

- **Total Revenue**: $${metrics.totalRevenue.toLocaleString()}
- **Total Units Sold**: ${metrics.totalUnitsSold.toLocaleString()}
- **Total Orders**: ${metrics.totalOrders.toLocaleString()}
- **Cancelled Orders**: ${metrics.cancelledOrders} (${((metrics.cancelledOrders / metrics.totalOrders) * 100).toFixed(1)}% cancellation rate)
- **Best Performing Region**: ${metrics.bestPerformingRegion}
- **Best Performing Product Category**: ${metrics.bestPerformingCategory}

### Revenue by Region
${Object.entries(metrics.regionBreakdown)
  .sort(([, a], [, b]) => b - a)
  .map(([region, revenue]) => `- ${region}: $${revenue.toLocaleString()}`)
  .join("\n")}

### Revenue by Product Category
${Object.entries(metrics.categoryBreakdown)
  .sort(([, a], [, b]) => b - a)
  .map(([category, revenue]) => `- ${category}: $${revenue.toLocaleString()}`)
  .join("\n")}

---

The summary should contain the following sections:
1. **Executive Summary** — A high-level overview of overall performance.
2. **Key Highlights** — Top 3–5 bullet points.
3. **Regional Performance** — Breakdown and analysis by region.
4. **Product Performance** — Breakdown and analysis by product category.
5. **Operational Notes** — Commentary on cancelled orders and any operational observations.

Format the report in clean Markdown.`;

  logger.info("Generating AI summary via Groq (Llama 3)...");

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a professional business analyst who creates clear, concise executive reports from sales data.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.6,
    max_tokens: 2048,
  });

  const text = chatCompletion.choices[0]?.message?.content;

  if (!text) {
    throw new Error("AI did not return a summary. Please try again.");
  }

  logger.info("AI summary generated successfully", {
    length: text.length,
  });

  return text;
}
