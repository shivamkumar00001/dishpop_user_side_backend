import {
  getMostLovedDish,
  getUserMenu,
  getCategoryPreview,
  getMenuByCategory, // ✅ NEW
} from "../services/userMenu.service.js";


export async function getMenu(req, res) {
  try {
    const { username } = req.params;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const search = req.query.search?.trim() || null;

    /* ✅ TAGS (comma separated) */
    const tags = req.query.tags || null;

    const result = await getUserMenu(
      username,
      page,
      limit,
      search,
      tags // ✅ PASS TAGS
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Menu fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu",
    });
  }
}


export async function getMostLoved(req, res) {
  try {
    const { username } = req.params;

    const dish = await getMostLovedDish(username);

    res.status(200).json({
      success: true,
      data: dish,
    });
  } catch (err) {
    console.error("Most loved fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch most loved item",
    });
  }
}

/* =====================================================
   GET CATEGORY PREVIEW (FOR VISUAL CATEGORY SELECTOR)
===================================================== */
export async function getCategoryPreviewController(req, res) {
  try {
    const { username } = req.params;

    const categories = await getCategoryPreview(username);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Category preview fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category preview",
    });
  }
}


import { getLowestPricedItems } from "../services/userMenu.service.js";

export async function getLowestPriceItems(req, res) {
  try {
    const { username } = req.params;

    const items = await getLowestPricedItems(username);

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (err) {
    console.error("Lowest price fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lowest priced items",
    });
  }
}


import { getDishById } from "../services/userMenu.service.js";

export async function getDishDetails(req, res) {
  try {
    const { dishId } = req.params;

    const dish = await getDishById(dishId);

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found",
      });
    }

    res.status(200).json({
      success: true,
      data: dish,
    });
  } catch (err) {
    console.error("Dish detail fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dish details",
    });
  }
}

import { getSeasonalDishes } from "../services/userMenu.service.js";

export async function getSeasonal(req, res) {
  try {
    const { username } = req.params;

    const dishes = await getSeasonalDishes(username);

    res.status(200).json({
      success: true,
      data: dishes,
    });
  } catch (error) {
    console.error("Seasonal dishes fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch seasonal dishes",
    });
  }
}



export async function getMenuByCategoryController(req, res) {
  try {
    const { username, category } = req.params;

    const data = await getMenuByCategory(username, category);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("CATEGORY MENU ERROR", err);
    res.status(500).json({
      success: false,
      message: "Failed to load category menu",
    });
  }
}
