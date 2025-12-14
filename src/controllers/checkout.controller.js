import CheckoutService from "../services/checkout.service.js";

class CheckoutController {
  async createOrder(req, res) {
    try {
      const result = await CheckoutService.createOrder({
        ...req.body,
        username: req.params.username
      });

      const room = req.params.username;

      if (result.created) req.io?.to(room).emit("order-created", result.data);
      if (result.updated) req.io?.to(room).emit("order-updated", result.data);
      if (result.replaced) req.io?.to(room).emit("order-replaced", result.data);

      res.status(201).json({ success: true, data: result.data });

    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }
}

export default new CheckoutController();
