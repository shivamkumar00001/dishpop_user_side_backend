import Category from "../models/Category.js";
import Dish from "../models/Dish.js";
import "../models/AddOnGroup.js";
import "../models/AddOn.js";
import "../models/Tag.js";
import { ADDON_POPULATE } from "../utils/populate.config.js";
import { normalizeDishForMenu } from "../utils/dish.normalizer.js";

/* =====================================================
   GET USER MENU (CATEGORY + TAG FILTER SUPPORT)
===================================================== */
export async function getUserMenu(
  username,
  page = 1,
  limit = 3, // number of categories per page
  search = null,
  tags = null
) {
  const skip = (page - 1) * limit;

  // 1️⃣ Paginate categories
  const categories = await Category.find({
    username,
    isActive: true,
  })
    .sort({ order: 1 })
    .skip(skip)
    .limit(limit);

  // 2️⃣ Build dish query
  const dishQuery = {
    username,
    isAvailable: true,
    categoryId: { $in: categories.map((c) => c._id) },
  };

  if (search) {
    dishQuery.name = { $regex: search, $options: "i" };
  }

  if (tags && tags.length > 0) {
    dishQuery.tags = {
      $in: Array.isArray(tags) ? tags : tags.split(","),
    };
  }

  // 3️⃣ Fetch ALL dishes for these categories (WITH ADD-ONS)
  const dishes = await Dish.find(dishQuery)
    .sort({ popularityScore: -1, createdAt: -1 })
    .populate("categoryId", "name icon")
    .populate("tagDetails", "key name icon color")
    .populate(ADDON_POPULATE) // ✅ ADD-ONS POPULATED
    .lean();

  // 4️⃣ Group + NORMALIZE dishes by category
  const menu = categories.map((cat) => ({
    id: cat._id,
    name: cat.name,
    icon: cat.icon,
    dishes: dishes
      .filter(
        (dish) => dish.categoryId._id.toString() === cat._id.toString()
      )
      .map(normalizeDishForMenu), // ✅ CRITICAL FIX
  }));

  // 5️⃣ Pagination info
  const totalCategories = await Category.countDocuments({
    username,
    isActive: true,
  });

  return {
    menu,
    pagination: {
      page,
      limit,
      hasMore: skip + categories.length < totalCategories,
    },
  };
}



export async function getMostLovedDish(username) {
  const dishes = await Dish.find({
    username,
    isAvailable: true,
    tags: "most-loved",
  })
    .sort({ popularityScore: -1, createdAt: -1 })
    .limit(10)
    .populate("categoryId", "name icon")
    .populate("tagDetails", "key name icon color")
    .populate(ADDON_POPULATE)          // ✅ ADD-ONS
    .lean();

  if (!dishes || dishes.length === 0) return [];

  // ✅ Normalize all dishes (SAME SHAPE AS MENU)
  return dishes.map(normalizeDishForMenu);
}



/* =====================================================
   GET CATEGORY PREVIEW (ONE DISH PER CATEGORY)
===================================================== */
export async function getCategoryPreview(username) {
  const categories = await Category.find({
    username,
    isActive: true,
  })
    .sort({ order: 1 })
    .lean();

  if (!categories.length) return [];

  const categoryIds = categories.map((c) => c._id);

  const dishes = await Dish.aggregate([
    {
      $match: {
        username,
        isAvailable: true,
        categoryId: { $in: categoryIds },
      },
    },
    {
      $sort: {
        popularityScore: -1,
        createdAt: -1,
      },
    },
    {
      $group: {
        _id: "$categoryId",
        dishId: { $first: "$_id" },
        imageUrl: { $first: "$imageUrl" },
        thumbnailUrl: { $first: "$thumbnailUrl" },
      },
    },
  ]);

  const dishMap = new Map(
    dishes.map((d) => [String(d._id), d])
  );

  return categories.map((cat) => {
    const dish = dishMap.get(String(cat._id));

    return {
      categoryId: cat._id,
      categoryName: cat.name,
      categoryIcon: cat.icon,
      dishId: dish?.dishId ?? null,
      imageUrl: dish?.imageUrl || dish?.thumbnailUrl || null,
    };
  });
}


/* =====================================================
   GET LOWEST PRICED ITEMS (TOP 15)
===================================================== */
export async function getLowestPricedItems(username) {
  const dishes = await Dish.find({
    username,
    isAvailable: true,
  })
    .sort({ "variants.price": 1 }) // 🔥 minimum price first
    .limit(15)
    .populate("categoryId", "name icon")
    .populate("tagDetails", "key name icon color")
    .populate(ADDON_POPULATE)          // ✅ ADD-ONS
    .lean();

  if (!dishes || dishes.length === 0) return [];

  // ✅ SAME SHAPE AS MENU / MOST LOVED
  return dishes.map(normalizeDishForMenu);
}



/* =====================================================
   GET SEASONAL DISHES
===================================================== */
export async function getSeasonalDishes(username) {
  const dishes = await Dish.find({
    username,
    isAvailable: true,
    tags: "seasonal",
  })
    .sort({ popularityScore: -1, createdAt: -1 })
    .limit(10)
    .populate("categoryId", "name icon")
    .populate("tagDetails", "key name icon color")
    .populate(ADDON_POPULATE)          // ✅ ADD-ONS POPULATED
    .lean();

  if (!dishes || dishes.length === 0) return [];

  // ✅ SAME SHAPE AS MENU / MOST LOVED / LOWEST PRICE
  return dishes.map(normalizeDishForMenu);
}



/* =====================================================
   GET USER MENU BY CATEGORY (FOR CATEGORY PAGE)
===================================================== */
export async function getMenuByCategory(username, categorySlug) {
  // 1️⃣ Find category by name/slug
  const category = await Category.findOne({
    username,
    isActive: true,
    name: new RegExp(`^${categorySlug}$`, "i"),
  }).lean();

  if (!category) {
    return null;
  }

  // 2️⃣ Fetch dishes of this category (WITH ADD-ONS)
  const dishes = await Dish.find({
    username,
    isAvailable: true,
    categoryId: category._id,
  })
    .sort({ popularityScore: -1, createdAt: -1 })
    .populate("categoryId", "name icon")
    .populate("tagDetails", "key name icon color")
    .populate(ADDON_POPULATE) // ✅ SHARED CONFIG
    .lean();

  // 3️⃣ Normalize dishes (SAME SHAPE EVERYWHERE)
  const normalizedDishes = dishes.map(normalizeDishForMenu);

  return {
    category: {
      id: category._id,
      name: category.name,
      icon: category.icon,
    },
    dishes: normalizedDishes,
  };
}





export async function getDishById(dishId) {
  const dish = await Dish.findById(dishId)
    .populate("categoryId", "name icon")
    .populate("tagDetails", "key name icon color")
    .populate(ADDON_POPULATE) // ✅ shared populate
    .lean();

  if (!dish) return null;

  // ✅ SAME SHAPE AS ALL OTHER APIs
  return normalizeDishForMenu(dish);
}
