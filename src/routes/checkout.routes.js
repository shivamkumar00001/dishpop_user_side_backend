import express from "express";
import CheckoutController from "../controllers/checkout.controller.js";

const router = express.Router();

// FINAL ROUTE: /api/checkout/:username
router.post("/:username", CheckoutController.createOrder);

export default router;
