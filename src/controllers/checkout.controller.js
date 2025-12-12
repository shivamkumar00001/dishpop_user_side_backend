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

      // Decide message based on what happened
      let message = "Order created successfully";

      if (result.updated) {
        message = "Order updated successfully";
      } else if (result.replaced) {
        message = "Previous order removed and new order created";
      }

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
