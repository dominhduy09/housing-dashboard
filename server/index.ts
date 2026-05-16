import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { predictPrice } from "./prediction.js";
import { parseCSV, generateCSV, validatePropertyRecord, type PredictionRecord, type PropertyRecord } from "./csv-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json({ limit: '50mb' }));

  // Prediction API endpoint
  app.post("/api/predict", async (req, res) => {
    try {
      const result = await predictPrice(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Prediction failed"
      });
    }
  });

  // Batch prediction API endpoint
  app.post("/api/batch-predict", async (req, res) => {
    try {
      const { csv_content } = req.body;
      if (!csv_content) {
        return res.status(400).json({
          success: false,
          error: "Missing csv_content"
        });
      }

      // Parse CSV
      const records = parseCSV(csv_content);
      if (records.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No valid records found in CSV"
        });
      }

      // Process predictions
      const predictions: PredictionRecord[] = [];
      for (const record of records) {
        const validationError = validatePropertyRecord(record);
        if (validationError) {
          predictions.push({
            ...record,
            predicted_price: 0,
            price_in_dollars: 0,
            confidence: 0,
            error: validationError
          });
        } else {
          const result = await predictPrice(record);
          predictions.push({
            ...record,
            predicted_price: result.predicted_price,
            price_in_dollars: result.price_in_dollars,
            confidence: result.confidence,
            error: result.error
          });
        }
      }

      // Generate output CSV
      const outputCSV = generateCSV(predictions);

      res.json({
        success: true,
        total: predictions.length,
        successful: predictions.filter(p => !p.error).length,
        failed: predictions.filter(p => p.error).length,
        csv_content: outputCSV
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Batch prediction failed"
      });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || (process.env.NODE_ENV === 'production' ? 3000 : 3001);

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
