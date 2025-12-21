import { getUserMenu } from "../services/userMenu.service.js";

export async function getMenu(req, res) {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const search = req.query.search?.trim() || null;

    const result = await getUserMenu(
      username,
      page,
      limit,
      search
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
