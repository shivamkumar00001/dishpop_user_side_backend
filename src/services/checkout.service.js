// services/checkout.service.js
import Customer from "../models/coustomer.model.js";

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
      customerName,
      phoneNumber,
      tableNumber,
      description,

      items: normalizedItems,
      grandTotal,
    });

    return {
      created: true,
      data: order,
    };
  }
}

export default CheckoutService;
