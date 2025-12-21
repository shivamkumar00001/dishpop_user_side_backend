// controllers/checkout.controller.js
import CheckoutService from "../services/checkout.service.js";
import { publishOrderEvent } from "../config/publishOrderEvent.js";

class CheckoutController {
  async createOrder(req, res) {
    try {
      const { username } = req.params;

      if (!username) {
        return res.status(400).json({
          success: false,
          message: "Restaurant username is required",
        });
      }

      const {
        customerName,
        phoneNumber,
        tableNumber,
        description,
        items,
        grandTotal,
      } = req.body;

      const result = await CheckoutService.createOrder({
        username,
        customerName,
        phoneNumber,
        tableNumber,
        description,
        items,
        grandTotal, // 🔥 FIXED
      });

      /* 🔥 REDIS EVENTS (UNCHANGED) */
      if (result.created) {
        await publishOrderEvent("order-created", username, result.data);
      }

      if (result.updated) {
        await publishOrderEvent("order-updated", username, result.data);
      }

      if (result.replaced) {
        await publishOrderEvent("order-replaced", username, result.data);
      }

      return res.status(201).json({
        success: true,
        data: result.data,
      });

    } catch (err) {
      console.error("Checkout error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "Checkout failed",
      });
    }
  }
}

export default new CheckoutController();
