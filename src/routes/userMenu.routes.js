import express from "express";
import { getMenu } from "../controllers/userMenu.controller.js";

const router = express.Router();

router.get("/:username/menu", getMenu);

export default router;
