import express from "express";
import {
  getMenu,
  getMostLoved,
  getCategoryPreviewController,
  getLowestPriceItems,
  getDishDetails,
  getMenuByCategoryController, // ✅ ADD THIS
} from "../controllers/userMenu.controller.js";

import checkSubscription from "../middlewares/checkSubscription.js";

const router = express.Router();

// 🔒 Full menu (paginated)
router.get("/:username/menu",  getMenu);

// 🔒 Most loved
router.get("/:username/menu/most-loved", getMostLoved);

// 🔒 Category preview
router.get(
  "/:username/menu/category-preview",
  // checkSubscription,
  getCategoryPreviewController
);

// 🔒 Lowest price items
router.get(
  "/:username/menu/lowest-price",
  // checkSubscription,
  getLowestPriceItems
);

// 🔒 FULL DISH DETAILS (⭐ REQUIRED FIX ⭐)
router.get(
  "/:username/dish/:dishId",
  // checkSubscription,
  getDishDetails
);


import { getSeasonal } from "../controllers/userMenu.controller.js";

// 🔒 Seasonal dishes
router.get(
  "/:username/menu/seasonal",
  // checkSubscription,
  getSeasonal
);


// 🔒 CATEGORY MENU (🔥 FIX FOR 404 🔥)
router.get(
  "/:username/menu/category/:category",
  // checkSubscription,
  getMenuByCategoryController
);

export default router;
