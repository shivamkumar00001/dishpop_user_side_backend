import express from "express";
import ownerController from "../controllers/owner.controller.js";

const router = express.Router();

router.get("/:username/landing", ownerController.getRestaurantLanding);

export default router;
