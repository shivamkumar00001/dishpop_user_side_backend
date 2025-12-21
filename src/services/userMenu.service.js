import Category from "../models/Category.js";
import Dish from "../models/Dish.js";
import "../models/AddOnGroup.js";
import "../models/AddOn.js";

export async function getUserMenu(
  username,
  page = 1,
  limit = 15,
  search = null
) {
  const skip = (page - 1) * limit;

  // 1️⃣ Categories (always full)
  const categories = await Category.find({
    username,
    isActive: true,
  }).sort({ order: 1 });

  // 2️⃣ Dish query
  const dishQuery = {
    username,
    isAvailable: true,
  };

  if (search) {
    dishQuery.name = { $regex: search, $options: "i" };
  }

  // 3️⃣ Fetch dishes
  const dishes = await Dish.find(dishQuery)
    .sort({ popularityScore: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("categoryId", "name icon")
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

  const totalDishes = await Dish.countDocuments(dishQuery);

  // 4️⃣ Transform dishes
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

  // 5️⃣ Group by category
  const menu = categories.map((cat) => ({
    id: cat._id,
    name: cat.name,
    icon: cat.icon,
    dishes: formattedDishes.filter(
      (d) => d.category.id.toString() === cat._id.toString()
    ),
  }));

  return {
    menu,
    pagination: {
      page,
      limit,
      totalDishes,
      hasMore: skip + dishes.length < totalDishes,
    },
  };
}
