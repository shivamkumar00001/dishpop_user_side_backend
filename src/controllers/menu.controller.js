import menuServices from "../services/menu.services.js";

class MenuController {
  async getMenu(req, res) {
    try {
      const { username } = req.params;
      const {
        limit = 20,
        skip = 0,
        category = "All",
        search = "",
      } = req.query;

      if (!username) {
        return res.status(400).json({
          success: false,
          message: "Restaurant ID is required",
        });
      }

      const result = await menuServices.getPaginatedMenu({
        username,
        limit: parseInt(limit),
        skip: parseInt(skip),
        category,
        search,
      });

      if (result.total === 0) {
        return res.status(404).json({
          success: false,
          message: "No menu items found for this restaurant.",
        });
      }

      return res.status(200).json({
        success: true,
        data: result.data,
        total: result.total,
        categories: result.allCategories,   // ⭐ send all categories from DB
      });


    } catch (error) {
      console.error("Menu fetch error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new MenuController();
