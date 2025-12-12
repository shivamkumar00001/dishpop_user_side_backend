import express from "express";
import CheckoutController from "../controllers/checkout.controller.js";
import { validate } from "../middlewares/validate.js";
import { checkoutSchema } from "../validators/checkout.schema.js";

const router = express.Router();

router.post(
  "/:username",
  validate(checkoutSchema),
  CheckoutController.createOrder
);

export default router;
