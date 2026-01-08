// services/checkout.service.js
import Customer from "../models/coustomer.model.js";
import Session from "../models/Session.js";

/**
 * CREATE ORDER (SESSION-AWARE)
 * This function is SAFE, ATOMIC, and POS-GRADE
 */
export async function createOrder(payload) {
  const {
    username,
    customerName,
    phoneNumber,
    tableNumber,
    description,
    items,
    grandTotal,
    sessionId,
  } = payload;

  /* ---------------- VALIDATION ---------------- */
  if (!username || !customerName || !tableNumber) {
    throw new Error("Username, customer name and table number required");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No items in order");
  }

  if (typeof grandTotal !== "number") {
    throw new Error("Grand total missing");
  }

  /* ---------------- SESSION HANDLING ---------------- */
  let session;

  if (sessionId) {
    session = await Session.findOne({
      sessionId,
      username,
    });

    if (!session) {
      throw new Error("Invalid session");
    }
  } else {
    const result = await Session.findOrCreateActive({
      username,
      tableNumber,
      customerName,
      phoneNumber,
    });

    session = result.session;
  }

  // 🔥 HARD BLOCK AFTER BILLING
  if (session.status !== "ACTIVE") {
    throw new Error("Session is closed. Please start a new order.");
  }

  /* ---------------- NORMALIZE ITEMS ---------------- */
  const normalizedItems = items.map((item, idx) => {
    if (!item.variant?.name || typeof item.variant.price !== "number") {
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
      variant: item.variant,
      addons: item.addons || [],
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    };
  });

  /* ---------------- CREATE ORDER ---------------- */
  const order = await Customer.create({
    username,
    tableNumber,
    sessionId: session.sessionId,
    customerName,
    phoneNumber,
    description,
    items: normalizedItems,
    grandTotal,
  });

  /* ---------------- LINK ORDER TO SESSION ---------------- */
  session.orders.push(order._id);
  await session.save();

  /* ---------------- RETURN ---------------- */
  return {
    created: true,
    data: order,
    sessionId: session.sessionId,
    sessionStatus: session.status,
  };
}
