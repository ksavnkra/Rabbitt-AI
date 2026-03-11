import app from "./app.js";
import logger from "./config/logger.js";

const PORT = parseInt(process.env.PORT || "5000", 10);

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
});
