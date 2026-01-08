import Category from "../models/Category.js";
import Dish from "../models/Dish.js";
import "../models/AddOnGroup.js";
import "../models/AddOn.js";
import "../models/Tag.js";

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

  // 3️⃣ Fetch ALL dishes for these categories
  const dishes = await Dish.find(dishQuery)
    .sort({ popularityScore: -1, createdAt: -1 })
    .populate("categoryId", "name icon")
    .populate("tagDetails", "key name icon color")
    .lean();

  // 4️⃣ Group dishes by category
  const menu = categories.map((cat) => ({
    id: cat._id,
    name: cat.name,
    icon: cat.icon,
    dishes: dishes.filter(
      (dish) => dish.categoryId._id.toString() === cat._id.toString()
    ),
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
    .limit(10) // ✅ LIMIT TO MAX 10 DISHES
    .populate("categoryId", "name")
    .populate("tagDetails", "key name icon color")
    .lean();

  if (!dishes || dishes.length === 0) return [];

  return dishes.map((dish) => {
    const defaultVariant =
      dish.variants?.find((v) => v.isDefault) || dish.variants?.[0];

    return {
      ...dish,
      price: defaultVariant?.price ?? 0,
      tags: (dish.tagDetails || []).map((tag) => ({
        key: tag.key,
        name: tag.name,
        icon: tag.icon,
        color: tag.color,
      })),
    };
  });
}


/* =====================================================
   GET CATEGORY PREVIEW (ONE DISH PER CATEGORY)
===================================================== */
export async function getCategoryPreview(username) {
  /**
   * Strategy:
   * - Only active categories
   * - Pick 1 available dish per category
   * - Prefer popular dishes
   */

  const categories = await Category.find({
    username,
    isActive: true,
  }).sort({ order: 1 }).lean();

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
        name: { $first: "$name" },
        imageUrl: { $first: "$imageUrl" },
        thumbnailUrl: { $first: "$thumbnailUrl" },
      },
    },
  ]);

  const dishMap = new Map(
    dishes.map((d) => [d._id.toString(), d])
  );

  return categories.map((cat) => {
    const dish = dishMap.get(cat._id.toString());

    return {
      categoryId: cat._id,
      categoryName: cat.name,
      categoryIcon: cat.icon,

      // representative dish
      dishId: dish?.dishId || null,
      imageUrl:
        dish?.imageUrl ||
        dish?.thumbnailUrl ||
        null,
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
    .populate("categoryId", "name")
    .lean();

  return dishes.map((dish) => {
    const defaultVariant =
      dish.variants.find((v) => v.isDefault) ||
      dish.variants[0];

    return {
      id: dish._id,
      name: dish.name,
      imageUrl: dish.imageUrl,
      price: defaultVariant?.price ?? 0,
      category: dish.categoryId?.name,
      foodType: dish.foodType,
    };
  });
}


export async function getDishById(dishId) {
  const dish = await Dish.findById(dishId)
    .populate("categoryId", "name icon")
    .populate("tagDetails", "key name icon color")
    .populate({
      path: "addOnGroups",
      match: { isAvailable: true },
      populate: {
        path: "addOns",
        match: { isActive: true },
        select: "name price",
      },
    })
    .lean();

  if (!dish) return null;

  const defaultVariant =
    dish.variants.find((v) => v.isDefault) || dish.variants[0];

  return {
    id: dish._id,
    name: dish.name,
    description: dish.description,
    foodType: dish.foodType,
    imageUrl: dish.imageUrl,
    thumbnailUrl: dish.thumbnailUrl,

    variants: dish.variants,
    defaultVariant,

    addOnGroups: dish.addOnGroups.map((group) => ({
      id: group._id,
      name: group.name,
      required: group.required,
      minSelection: group.minSelection,
      maxSelection: group.maxSelection,
      addOns: group.addOns.map((addon) => ({
        id: addon._id,
        name: addon.name,
        price: addon.price,
      })),
    })),

    tags: (dish.tagDetails || []).map((tag) => ({
      key: tag.key,
      name: tag.name,
      icon: tag.icon,
      color: tag.color,
    })),

    category: {
      id: dish.categoryId._id,
      name: dish.categoryId.name,
      icon: dish.categoryId.icon,
    },
  };
}

/* =====================================================
   GET SEASONAL DISHES
===================================================== */
export async function getSeasonalDishes(username) {
  const dishes = await Dish.find({
    username,
    isAvailable: true,
    tags: "seasonal", // 🔥 KEY PART
  })
    .sort({ popularityScore: -1, createdAt: -1 })
    .limit(10)
    .populate("categoryId", "name icon")
    .populate("tagDetails", "key name icon color")
    .lean();

  if (!dishes || dishes.length === 0) return [];

  return dishes.map((dish) => {
    const defaultVariant =
      dish.variants?.find((v) => v.isDefault) ||
      dish.variants?.[0];

    return {
      id: dish._id,
      name: dish.name,
      description: dish.description,
      imageUrl: dish.imageUrl,
      thumbnailUrl: dish.thumbnailUrl,
      foodType: dish.foodType,

      // 🔥 IMPORTANT (for bottom sheet)
      variants: dish.variants || [],
      defaultVariant,

      addOnGroups: dish.addOnGroups || [],

      tags: (dish.tagDetails || []).map((tag) => ({
        key: tag.key,
        name: tag.name,
        icon: tag.icon,
        color: tag.color,
      })),

      category: {
        id: dish.categoryId?._id,
        name: dish.categoryId?.name,
        icon: dish.categoryId?.icon,
      },

      price: defaultVariant?.price ?? 0,
    };
  });
}


/* =====================================================
   GET USER MENU BY CATEGORY (FOR CATEGORY PAGE)
===================================================== */
export async function getMenuByCategory(username, categorySlug) {
  // 1️⃣ Find category by name/slug
  const category = await Category.findOne({
    username,
    isActive: true,
    name: new RegExp(`^${categorySlug}$`, "i"), // case-insensitive
  });

  if (!category) {
    return null;
  }

  // 2️⃣ Fetch dishes of this category
  const dishes = await Dish.find({
    username,
    isAvailable: true,
    categoryId: category._id,
  })
    .sort({ popularityScore: -1, createdAt: -1 })
    .populate("categoryId", "name icon")
    .populate("tagDetails", "key name icon color")
    .populate({
      path: "addOnGroups",
      match: { isAvailable: true },
      populate: {
        path: "addOns",
        match: { isActive: true },
        select: "name price",
      },
    })
    .lean();

  // 3️⃣ Format dishes (SAME FORMAT AS getUserMenu)
  const formattedDishes = dishes.map((dish) => {
    const defaultVariant =
      dish.variants.find((v) => v.isDefault) || dish.variants[0];

    return {
      id: dish._id,
      name: dish.name,
      description: dish.description,
      foodType: dish.foodType,

      imageUrl: dish.imageUrl,
      thumbnailUrl: dish.thumbnailUrl,

      arModel: dish.arModel || { isAvailable: false },

      tags: (dish.tagDetails || []).map((tag) => ({
        key: tag.key,
        name: tag.name,
        icon: tag.icon,
        color: tag.color,
      })),

      category: {
        id: dish.categoryId._id,
        name: dish.categoryId.name,
        icon: dish.categoryId.icon,
      },

      variants: dish.variants,
      defaultVariant,
      startingPrice: defaultVariant.price,

      addOnGroups: dish.addOnGroups.map((group) => ({
        id: group._id,
        name: group.name,
        required: group.required,
        minSelection: group.minSelection,
        maxSelection: group.maxSelection,
        addOns: group.addOns.map((addon) => ({
          id: addon._id,
          name: addon.name,
          price: addon.price,
        })),
      })),
    };
  });

  return {
    category: {
      id: category._id,
      name: category.name,
      icon: category.icon,
    },
    dishes: formattedDishes,
  };
}
