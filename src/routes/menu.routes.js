import { Router } from "express";
import menuController from "../controllers/menu.controller.js";

const router = Router();

// GET /api/menu/:restaurantId?limit=&skip=&category=&search=
router.get("/:username", menuController.getMenu);

export default router;