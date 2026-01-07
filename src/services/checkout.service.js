// services/checkout.service.js
import Customer from "../models/coustomer.model.js";
import crypto from "crypto";

class CheckoutService {
  static async createOrder(payload) {
    const {
      username,
      customerName,
      phoneNumber,
      tableNumber,
      description,
      items,
      grandTotal,

      // 🔹 NEW (optional)
      sessionId,
    } = payload;

    /* ---------------- VALIDATION ---------------- */
    if (!customerName || !tableNumber) {
      throw new Error("Customer name and table number required");
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("No items in order");
    }

    if (typeof grandTotal !== "number") {
      throw new Error("Grand total missing");
    }

    /* ---------------- SESSION HANDLING ---------------- */
    // Backward-compatible:
    // If frontend doesn't send sessionId, generate one
    const finalSessionId =
      sessionId || crypto.randomUUID();

    /* ---------------- NORMALIZE ITEMS ---------------- */
    const normalizedItems = items.map((item, idx) => {
      if (
        !item.variant?.name ||
        typeof item.variant.price !== "number"
      ) {
        throw new Error(`Invalid variant in item ${idx + 1}`);
      }

      if (
        typeof item.unitPrice !== "number" ||
        typeof item.totalPrice !== "number"
      ) {
        throw new Error(`Invalid pricing in item ${idx + 1}`);
      }

      return {
        itemId: item.itemId,
        name: item.name,
        imageUrl: item.imageUrl || "",

        qty: Number(item.qty),

        variant: {
          name: item.variant.name,
          price: item.variant.price,
        },

        addons: item.addons || [],

        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      };
    });

    /* ---------------- CREATE ORDER ---------------- */
    const order = await Customer.create({
      username,
      tableNumber,
      sessionId: finalSessionId, // ✅ added

      customerName,
      phoneNumber,
      description,

      items: normalizedItems,
      grandTotal,

      // status untouched (default = pending)
    });

    return {
      created: true,
      data: order,
      sessionId: finalSessionId, // 🔹 return to frontend
    };
  }
}

export default CheckoutService;
