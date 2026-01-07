import express from "express";
import axios from "axios";

const router = express.Router();

const RESTRO_BACKEND = process.env.RESTAURANT_BACKEND_URL;

/* ================= SAFETY CHECK ================= */
if (!RESTRO_BACKEND) {
  console.warn("⚠️ RESTAURANT_BACKEND_URL not set");
}

/* ================= RESTAURANT PUBLIC ================= */
router.get("/restaurants/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const response = await axios.get(
      `${RESTRO_BACKEND}/api/restaurants/${username}`
    );

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("❌ Restaurant proxy error:", err.message);
    res
      .status(err.response?.status || 404)
      .json({ message: "Restaurant not found" });
  }
});

/* ================= MENU PUBLIC ================= */
router.get("/menu/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const response = await axios.get(
      `${RESTRO_BACKEND}/api/menu/${username}`,
      { params: req.query }
    );

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("❌ Menu proxy error:", err.message);
    res
      .status(err.response?.status || 404)
      .json({ message: "Menu not found" });
  }
});

export default router;
