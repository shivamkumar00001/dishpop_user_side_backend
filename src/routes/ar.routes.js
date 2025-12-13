// routes/ar.routes.js
import express from "express";
import { incrementAR } from "../controllers/ar.controller.js";
import ARStatistics from "../models/arstatistics.model.js";

const router = express.Router();

// POST /api/ar/:restaurantId/increment
router.post("/:restaurantId", incrementAR);

// NEW: GET stats for a restaurant
router.get("/stats/:restaurantId", async (req, res) => {
  try {
    const { restaurantId} = req.params;

    // Fetch all stats for this restaurant
    const stats = await ARStatistics.find({ restaurantId })
      .sort({ date: 1 }); // oldest first

    res.json({ stats });
  } catch (error) {
    console.error("Fetch AR Stats Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
