import express from "express";
import cors from "cors";
import eventRoutes from "./routes/eventRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { sequelize, testConnection } from "./config/database.js";
import "./models/index.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "🎟️ TicketFlow API is running!",
    version: "2.0.0",
    endpoints: {
      events: "/api/events",
      sales: "/api/sales",
      health: "/health",
    },
  });
});

app.get("/health", async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: "healthy",
    database: dbStatus ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
    service: "TicketFlow Backend",
  });
});

// Seed endpoint (development only)
if (process.env.NODE_ENV === "development") {
  app.post("/api/seed", async (req, res) => {
    try {
      const { seed } = await import("./seeders/seed.js");
      await seed();
      res.json({
        success: true,
        message: "Database seeded successfully!",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Seed failed: " + error.message,
      });
    }
  });
}

// Error handling
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    console.log("🔄 Starting TicketFlow Backend...");

    // Test database connection
    await testConnection();

    // Sync database
    await sequelize.sync();
    console.log("✅ Database synchronized");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log(`❤️  Health: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

export default app;
