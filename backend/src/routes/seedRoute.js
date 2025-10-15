// src/routes/seedRoutes.js
import express from "express";
import { seed } from "../seeders/seed.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "TicketFlow Backend",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

router.get("/seed/status", async (req, res) => {
  try {
    const { Event } = await import("../models/index.js");
    const count = await Event.count();
    res.json({
      success: true,
      seeded: count > 0,
      eventCount: count,
      message: count > 0 ? "✅ Database has data" : "⚠️ Database empty",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "❌ Unable to check seed status",
      error: error.message,
    });
  }
});

router.post("/seed", async (req, res) => {
  try {
    console.log("🌱 Seeding database...");
    await seed();
    res.json({
      success: true,
      message: "✅ Database seeded successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "❌ Seed failed: " + error.message,
    });
  }
});

router.post("/seed/reset", async (req, res) => {
  try {
    console.log("🔄 Resetting and reseeding database...");
    const { Event, Sale } = await import("../models/index.js");
    await Sale.destroy({ where: {} });
    await Event.destroy({ where: {} });
    await seed();
    res.json({
      success: true,
      message: "🔄 Database reset successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "❌ Reset failed: " + error.message,
    });
  }
});

export default router;
