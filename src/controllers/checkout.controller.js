// import CheckoutService from "../services/checkout.service.js";

// class CheckoutController {
//   async createOrder(req, res) {
//     try {
//       const result = await CheckoutService.createOrder({
//         ...req.body,
//         username: req.params.username
//       });

//       const room = req.params.username;

//       if (result.created) req.io?.to(room).emit("order-created", result.data);
//       if (result.updated) req.io?.to(room).emit("order-updated", result.data);
//       if (result.replaced) req.io?.to(room).emit("order-replaced", result.data);

//       res.status(201).json({ success: true, data: result.data });

//     } catch (err) {
//       res.status(400).json({
//         success: false,
//         message: err.message
//       });
//     }
//   }
// }

// export default new CheckoutController();

import CheckoutService from "../services/checkout.service.js";
import { publishOrderEvent } from "../config/publishOrderEvent.js";

class CheckoutController {
  async createOrder(req, res) {
    try {
      const { username } = req.params;

      const result = await CheckoutService.createOrder({
        ...req.body,
        username
      });

      // 🔥 PUBLISH TO REDIS (restaurant backend will forward to sockets)
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
        data: result.data
      });

    } catch (err) {
      console.error("Checkout error:", err);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }
}

export default new CheckoutController();