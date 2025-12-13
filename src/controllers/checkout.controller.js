import CheckoutService from "../services/checkout.service.js";

class CheckoutController {
  async createOrder(req, res) {
    try {
      const { username } = req.params;

      const result = await CheckoutService.createOrder({
        ...req.body,
        username
      });

      if (!result.allowed) {
        return res.status(403).json({
          success: false,
          message: result.message,
        });
      }

      // 🔴 SOCKET EMITS (SAFE & ISOLATED)
      if (result.created) {
        req.io.to(username).emit("order-created", result.data);
      }

      if (result.updated) {
        req.io.to(username).emit("order-updated", result.data);
      }

      if (result.replaced) {
        req.io.to(username).emit("order-replaced", result.data);
      }

      // Response message
      let message = "Order created successfully";
      if (result.updated) message = "Order updated successfully";
      if (result.replaced) message = "Previous order removed and new order created";

      return res.status(201).json({
        success: true,
        message,
        data: result.data,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new CheckoutController();
