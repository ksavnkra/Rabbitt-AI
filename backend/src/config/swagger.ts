import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sales Insight Automator API",
      version: "1.0.0",
      description:
        "A secure API service that processes uploaded sales data (CSV/XLSX), generates an AI-powered executive summary using Google Gemini, and emails the result.",
      contact: {
        name: "Sales Insight Automator",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    paths: {
      "/api/analyze-sales": {
        post: {
          summary: "Analyze sales data",
          description:
            "Upload a CSV or XLSX file with sales data and an email address. The API parses the file, generates an AI executive summary, and emails it to the provided address.",
          tags: ["Sales"],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["file", "email"],
                  properties: {
                    file: {
                      type: "string",
                      format: "binary",
                      description:
                        "Sales data file (CSV or XLSX, max 5MB). Expected columns: Date, Product_Category, Region, Units_Sold, Unit_Price, Revenue, Status",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      description:
                        "Email address to send the generated summary to",
                      example: "manager@company.com",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Sales data analyzed and summary emailed successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        example: "success",
                      },
                      summary: {
                        type: "string",
                        example:
                          "## Executive Summary\n\nTotal revenue reached $1.2M across all regions with 15,000 units sold...",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request — missing file, invalid format, or missing email",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "error" },
                      message: {
                        type: "string",
                        example: "No file uploaded. Please upload a CSV or XLSX file.",
                      },
                    },
                  },
                },
              },
            },
            "429": {
              description: "Rate limit exceeded (5 requests per minute per IP)",
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "error" },
                      message: { type: "string", example: "Internal server error" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(swaggerDefinition);
