import express from "express";
import { getMenu } from "../controllers/userMenu.controller.js";
import checkSubscription from "../middlewares/checkSubscription.js";

const router = express.Router();

// 🔒 Menu accessible only if restaurant is subscribed
router.get(
  "/:username/menu",
  // checkSubscription,
  getMenu
);

export default router;
