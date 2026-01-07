// controllers/checkout.controller.js
// import CheckoutService from "../services/checkout.service.js";
// import { publishOrderEvent } from "../config/publishOrderEvent.js";

// class CheckoutController {
//   async createOrder(req, res) {
//     try {
//       const { username } = req.params;

//       if (!username) {
//         return res.status(400).json({
//           success: false,
//           message: "Restaurant username is required",
//         });
//       }

//       const {
//         customerName,
//         phoneNumber,
//         tableNumber,
//         description,
//         items,
//         grandTotal,
//       } = req.body;

//       const result = await CheckoutService.createOrder({
//         username,
//         customerName,
//         phoneNumber,
//         tableNumber,
//         description,
//         items,
//         grandTotal, // 🔥 FIXED
//       });

//       /* 🔥 REDIS EVENTS (UNCHANGED) */
//       if (result.created) {
//         await publishOrderEvent("order-created", username, result.data);
//       }

//       if (result.updated) {
//         await publishOrderEvent("order-updated", username, result.data);
//       }

//       if (result.replaced) {
//         await publishOrderEvent("order-replaced", username, result.data);
//       }

//       return res.status(201).json({
//         success: true,
//         data: result.data,
//       });

//     } catch (err) {
//       console.error("Checkout error:", err);
//       return res.status(400).json({
//         success: false,
//         message: err.message || "Checkout failed",
//       });
//     }
//   }
// }

// export default new CheckoutController();





// controllers/checkout.controller.js
// import CheckoutService from "../services/checkout.service.js";
// import { publishOrderEvent } from "../config/publishOrderEvent.js";
// import restaurantSocketService from "../services/restaurantSocket.services.js";

// class CheckoutController {
//   async createOrder(req, res) {
//     try {
//       const { username } = req.params;
//       if (!username) {
//         return res.status(400).json({
//           success: false,
//           message: "Restaurant username is required",
//         });
//       }

//       const {
//         customerName,
//         phoneNumber,
//         tableNumber,
//         description,
//         items,
//         grandTotal,
//       } = req.body;

//       // Create order via your existing service
//       const result = await CheckoutService.createOrder({
//         username,
//         customerName,
//         phoneNumber,
//         tableNumber,
//         description,
//         items,
//         grandTotal,
//       });

//       // 🔥 REDIS EVENTS (UNCHANGED - Your existing logic)
//       if (result.created) {
//         await publishOrderEvent("order-created", username, result.data);
//       }
//       if (result.updated) {
//         await publishOrderEvent("order-updated", username, result.data);
//       }
//       if (result.replaced) {
//         await publishOrderEvent("order-replaced", username, result.data);
//       }

//       // 🆕 SOCKET.IO - Send to restaurant backend for real-time dashboard update
//       try {
//         const socketStatus = restaurantSocketService.getStatus();
        
//         if (socketStatus.connected) {
//           console.log("📡 Broadcasting order to restaurant dashboard via Socket.IO");
          
//           // Send via Socket.IO for real-time update
//           await restaurantSocketService.sendOrder({
//             username,
//             tableNumber: parseInt(tableNumber),
//             customerName,
//             phoneNumber: phoneNumber || "",
//             description: description || "",
//             items: items.map(item => ({
//               itemId: item.itemId || item.id || item._id,
//               name: item.name,
//               imageUrl: item.imageUrl || item.image || "",
//               qty: item.qty || item.quantity,
//               variant: {
//                 name: item.variant?.name || "Regular",
//                 price: item.variant?.price || item.price || 0,
//               },
//               addons: item.addons?.map(addon => ({
//                 id: addon.id || addon._id,
//                 name: addon.name,
//                 price: addon.price,
//               })) || [],
//               unitPrice: item.unitPrice || item.price || 0,
//               totalPrice: item.totalPrice || item.total || 0,
//             })),
//             grandTotal: parseFloat(grandTotal),
//           });
          
//           console.log("✅ Order sent to restaurant dashboard (real-time)");
//         } else {
//           console.log("⚠️ Socket.IO not connected - order saved but dashboard won't update in real-time");
//         }
//       } catch (socketError) {
//         // Don't fail the order if Socket.IO fails
//         console.error("⚠️ Socket.IO broadcast failed:", socketError.message);
//         console.log("📝 Order still saved successfully, but dashboard needs manual refresh");
//       }

//       // Return success response
//       return res.status(201).json({
//         success: true,
//         data: result.data,
//       });
//     } catch (err) {
//       console.error("Checkout error:", err);
//       return res.status(400).json({
//         success: false,
//         message: err.message || "Checkout failed",
//       });
//     }
//   }

//   // 🆕 Get Socket.IO connection status
//   async getSocketStatus(req, res) {
//     try {
//       const status = restaurantSocketService.getStatus();
      
//       return res.status(200).json({
//         success: true,
//         connected: status.connected,
//         socketId: status.socketId,
//         restaurantBackendUrl: process.env.RESTAURANT_BACKEND_URL || "Not configured",
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to get socket status",
//       });
//     }
//   }
// }

// export default new CheckoutController();













// // controllers/checkout.controller.js
// import CheckoutService from "../services/checkout.service.js";
// import { publishOrderEvent } from "../config/publishOrderEvent.js";
// import restaurantSocketService from "../services/restaurantSocket.services.js";

// class CheckoutController {
//   async createOrder(req, res) {
//     try {
//       const { username } = req.params;
//       if (!username) {
//         return res.status(400).json({
//           success: false,
//           message: "Restaurant username is required",
//         });
//       }

//       const {
//         customerName,
//         phoneNumber,
//         tableNumber,
//         description,
//         items,
//         grandTotal,
//       } = req.body;

//       /* 🔒 SINGLE SOURCE OF TRUTH — DB WRITE */
//       const result = await CheckoutService.createOrder({
//         username,
//         customerName,
//         phoneNumber,
//         tableNumber,
//         description,
//         items,
//         grandTotal,
//       });

//       /* ================= REDIS EVENTS ================= */
//       // 🔥 Redis should ONLY notify — never create orders
//       if (result.created) {
//         publishOrderEvent("order-created", username, result.data);
//       }

//       /* ================= SOCKET.IO ================= */
//       // 🔥 Send live update ONLY for newly created orders
//       if (result.created) {
//         try {
//           const socketStatus = restaurantSocketService.getStatus();

//           if (socketStatus.connected) {
//             console.log("📡 Broadcasting order to restaurant dashboard");

//             restaurantSocketService.sendOrder({
//               username,
//               tableNumber: Number(tableNumber),
//               customerName,
//               phoneNumber: phoneNumber || "",
//               description: description || "",
//               items: items.map((item) => ({
//                 itemId: item.itemId || item.id || item._id,
//                 name: item.name,
//                 imageUrl: item.imageUrl || item.image || "",
//                 qty: item.qty || item.quantity,
//                 variant: {
//                   name: item.variant?.name || "Regular",
//                   price: item.variant?.price || item.price || 0,
//                 },
//                 addons:
//                   item.addons?.map((addon) => ({
//                     id: addon.id || addon._id,
//                     name: addon.name,
//                     price: addon.price,
//                   })) || [],
//                 unitPrice: item.unitPrice || item.price || 0,
//                 totalPrice: item.totalPrice || item.total || 0,
//               })),
//               grandTotal: Number(grandTotal),
//             });

//             console.log("✅ Live order sent to dashboard");
//           }
//         } catch (socketError) {
//           console.error(
//             "⚠️ Socket broadcast failed:",
//             socketError.message
//           );
//         }
//       }

//       /* ================= RESPONSE ================= */
//       return res.status(201).json({
//         success: true,
//         data: result.data,
//       });
//     } catch (err) {
//       console.error("Checkout error:", err);
//       return res.status(400).json({
//         success: false,
//         message: err.message || "Checkout failed",
//       });
//     }
//   }

//   async getSocketStatus(req, res) {
//     try {
//       const status = restaurantSocketService.getStatus();
//       return res.status(200).json({
//         success: true,
//         connected: status.connected,
//         socketId: status.socketId,
//       });
//     } catch {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to get socket status",
//       });
//     }
//   }
// }

// export default new CheckoutController();








// ============================================================
// FILE PATH: controllers/checkout.controller.js (CUSTOMER BACKEND)
// DESCRIPTION: FINAL CORRECTED - Uses notifyOrderCreated() method
// ============================================================


import CheckoutService from "../services/checkout.service.js";
import { publishOrderEvent } from "../config/publishOrderEvent.js";
import restaurantSocketService from "../services/restaurantSocket.services.js";

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

        // 🔹 NEW (optional, backward compatible)
        sessionId,
      } = req.body;

      // ===============================================
      // 1. CREATE ORDER IN DATABASE
      // ===============================================
      const result = await CheckoutService.createOrder({
        username,
        customerName,
        phoneNumber,
        tableNumber,
        description,
        items,
        grandTotal,

        // 🔹 forward sessionId
        sessionId,
      });

      // ===============================================
      // 2. REDIS EVENTS (UNCHANGED)
      // ===============================================
      if (result.created) {
        publishOrderEvent("order-created", username, result.data);
      }

      if (result.updated) {
        publishOrderEvent("order-updated", username, result.data);
      }

      if (result.replaced) {
        publishOrderEvent("order-replaced", username, result.data);
      }

      // ===============================================
      // 3. SOCKET.IO - NOTIFY RESTAURANT
      // ===============================================
      if (result.created && result.data._id) {
        try {
          const socketStatus = restaurantSocketService.getStatus();

          if (socketStatus.connected) {
            console.log("📡 Notifying restaurant backend about new order");

            await restaurantSocketService.notifyOrderCreated(
              result.data._id.toString(),
              username
            );

            console.log(`✅ Restaurant notified - Order ID: ${result.data._id}`);
          } else {
            console.log("⚠️ Socket.IO not connected - order saved only");
          }
        } catch (socketError) {
          console.error("⚠️ Socket notification failed:", socketError.message);
        }
      }

      // ===============================================
      // 4. RETURN SUCCESS RESPONSE
      // ===============================================
      return res.status(201).json({
        success: true,
        data: result.data,

        // 🔹 IMPORTANT: return sessionId to frontend
        sessionId: result.sessionId,
      });
    } catch (err) {
      console.error("Checkout error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "Checkout failed",
      });
    }
  }

  async getSocketStatus(req, res) {
    try {
      const status = restaurantSocketService.getStatus();
      return res.status(200).json({
        success: true,
        connected: status.connected,
        socketId: status.socketId,
        restaurantBackendUrl:
          process.env.RESTAURANT_BACKEND_URL || "Not configured",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to get socket status",
      });
    }
  }
}

export default new CheckoutController();
