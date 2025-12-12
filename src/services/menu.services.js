import MenuItemModel from "../models/menuItem.model.js";

class MenuService {
  async getPaginatedMenu({ username, limit, skip, category, search }) {

    // 🔥 Always fetch ALL categories from restaurant
    const allCategories = await MenuItemModel.distinct("category", {
      username,
      available: true,
      category: { $nin: ["", null] }
    });

    const match = {
      username,
      available: true,
    };

    // CATEGORY FILTER
    if (category && category !== "All") {
      match.category = category;
    }

    // SEARCH FILTER
    if (search && search.trim() !== "") {
      match.name = { $regex: search.trim(), $options: "i" };
    }

    // TOTAL COUNT BEFORE PAGINATION
    const total = await MenuItemModel.countDocuments(match);

    // PAGINATED RESULTS
    const data = await MenuItemModel.find(match)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return { data, total, allCategories };
  }
}

export default new MenuService();
