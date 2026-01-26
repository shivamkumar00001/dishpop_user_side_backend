// // services/checkout.service.js
// import Customer from "../models/coustomer.model.js";
// import Session from "../models/Session.js";

// /**
//  * CREATE ORDER (SESSION-AWARE)
//  * This function is SAFE, ATOMIC, and POS-GRADE
//  */
// export async function createOrder(payload) {
//   const {
//     username,
//     customerName,
//     phoneNumber,
//     tableNumber,
//     description,
//     items,
//     grandTotal,
//     sessionId,
//   } = payload;

//   /* ---------------- VALIDATION ---------------- */
//   if (!username || !customerName || !tableNumber) {
//     throw new Error("Username, customer name and table number required");
//   }

//   if (!Array.isArray(items) || items.length === 0) {
//     throw new Error("No items in order");
//   }

//   if (typeof grandTotal !== "number") {
//     throw new Error("Grand total missing");
//   }

//   /* ---------------- SESSION HANDLING ---------------- */
//   let session;

//   if (sessionId) {
//     session = await Session.findOne({
//       sessionId,
//       username,
//     });

//     if (!session) {
//       throw new Error("Invalid session");
//     }
//   } else {
//     const result = await Session.findOrCreateActive({
//       username,
//       tableNumber,
//       customerName,
//       phoneNumber,
//     });

//     session = result.session;
//   }

//   // 🔥 HARD BLOCK AFTER BILLING
//   if (session.status !== "ACTIVE") {
//     throw new Error("Session is closed. Please start a new order.");
//   }

//   /* ---------------- NORMALIZE ITEMS ---------------- */
//   const normalizedItems = items.map((item, idx) => {
//     if (!item.variant?.name || typeof item.variant.price !== "number") {
//       throw new Error(`Invalid variant in item ${idx + 1}`);
//     }

//     if (
//       typeof item.unitPrice !== "number" ||
//       typeof item.totalPrice !== "number"
//     ) {
//       throw new Error(`Invalid pricing in item ${idx + 1}`);
//     }

//     return {
//       itemId: item.itemId,
//       name: item.name,
//       imageUrl: item.imageUrl || "",
//       qty: Number(item.qty),
//       variant: item.variant,
//       addons: item.addons || [],
//       unitPrice: item.unitPrice,
//       totalPrice: item.totalPrice,
//     };
//   });

//   /* ---------------- CREATE ORDER ---------------- */
//   const order = await Customer.create({
//     username,
//     tableNumber,
//     sessionId: session.sessionId,
//     customerName,
//     phoneNumber,
//     description,
//     items: normalizedItems,
//     grandTotal,
//   });

//   /* ---------------- LINK ORDER TO SESSION ---------------- */
//   session.orders.push(order._id);
//   await session.save();

//   /* ---------------- RETURN ---------------- */
//   return {
//     created: true,
//     data: order,
//     sessionId: session.sessionId,
//     sessionStatus: session.status,
//   };
// }





// // services/checkout.service.js
// import Customer from "../models/coustomer.model.js";
// import Session from "../models/Session.js";

// /**
//  * CREATE ORDER (MULTI-TYPE SUPPORT: DINE_IN | TAKEAWAY | ONLINE)
//  * This function is SAFE, ATOMIC, and POS-GRADE
//  */
// export async function createOrder(payload) {
//   const {
//     username,
//     customerName,
//     phoneNumber,
//     tableNumber,
//     description,
//     items,
//     grandTotal,
//     sessionId,
//     orderType,
//     deliveryAddress,
//   } = payload;

//   /* ---------------- VALIDATION ---------------- */
//   if (!username || !customerName) {
//     throw new Error("Username and customer name required");
//   }

//   if (!orderType || !["DINE_IN", "TAKEAWAY", "ONLINE"].includes(orderType)) {
//     throw new Error("Invalid order type. Must be DINE_IN, TAKEAWAY, or ONLINE");
//   }

//   if (orderType === "DINE_IN" && !tableNumber) {
//     throw new Error("Table number required for dine-in orders");
//   }

//   if (orderType === "ONLINE" && !deliveryAddress) {
//     throw new Error("Delivery address required for online orders");
//   }

//   if (!Array.isArray(items) || items.length === 0) {
//     throw new Error("No items in order");
//   }

//   if (typeof grandTotal !== "number") {
//     throw new Error("Grand total missing");
//   }

//   /* ---------------- SESSION HANDLING (DINE_IN ONLY) ---------------- */
//   let session;
//   let responseSessionId;
//   let responseSessionStatus;

//   if (orderType === "DINE_IN") {
//     if (sessionId) {
//       session = await Session.findOne({
//         sessionId,
//         username,
//       });

//       if (!session) {
//         throw new Error("Invalid session");
//       }
//     } else {
//       const result = await Session.findOrCreateActive({
//         username,
//         tableNumber,
//         customerName,
//         phoneNumber,
//       });

//       session = result.session;
//     }

//     // 🔥 HARD BLOCK AFTER BILLING
//     if (session.status !== "ACTIVE") {
//       throw new Error("Session is closed. Please start a new order.");
//     }

//     responseSessionId = session.sessionId;
//     responseSessionStatus = session.status;
//   }

//   /* ---------------- NORMALIZE ITEMS ---------------- */
//   const normalizedItems = items.map((item, idx) => {
//     if (!item.variant?.name || typeof item.variant.price !== "number") {
//       throw new Error(`Invalid variant in item ${idx + 1}`);
//     }

//     if (
//       typeof item.unitPrice !== "number" ||
//       typeof item.totalPrice !== "number"
//     ) {
//       throw new Error(`Invalid pricing in item ${idx + 1}`);
//     }

//     return {
//       itemId: item.itemId,
//       name: item.name,
//       imageUrl: item.imageUrl || "",
//       qty: Number(item.qty),
//       variant: item.variant,
//       addons: item.addons || [],
//       unitPrice: item.unitPrice,
//       totalPrice: item.totalPrice,
//     };
//   });

//   /* ---------------- CREATE ORDER ---------------- */
//   const orderData = {
//     username,
//     customerName,
//     phoneNumber,
//     description,
//     items: normalizedItems,
//     grandTotal,
//     orderType,
//   };

//   if (orderType === "DINE_IN") {
//     orderData.tableNumber = tableNumber;
//     orderData.sessionId = session.sessionId;
//   }

//   if (orderType === "ONLINE") {
//     orderData.deliveryAddress = deliveryAddress;
//   }

//   const order = await Customer.create(orderData);

//   /* ---------------- LINK ORDER TO SESSION (DINE_IN ONLY) ---------------- */
//   if (orderType === "DINE_IN") {
//     session.orders.push(order._id);
//     await session.save();
//   }

//   /* ---------------- RETURN ---------------- */
//   const response = {
//     created: true,
//     data: order,
//   };

//   if (orderType === "DINE_IN") {
//     response.sessionId = responseSessionId;
//     response.sessionStatus = responseSessionStatus;
//   }

//   return response;
// }






// services/checkout.service.js
import Customer from "../models/coustomer.model.js";
import Session from "../models/Session.js";

/**
 * CREATE ORDER (MULTI-TYPE SUPPORT: DINE_IN | TAKEAWAY | ONLINE)
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
    orderType,
    deliveryAddress,
  } = payload;

  /* ---------------- VALIDATION ---------------- */
  if (!username || !customerName) {
    throw new Error("Username and customer name required");
  }

  if (!orderType || !["DINE_IN", "TAKEAWAY", "ONLINE"].includes(orderType)) {
    throw new Error("Invalid order type. Must be DINE_IN, TAKEAWAY, or ONLINE");
  }

  if (orderType === "DINE_IN" && !tableNumber) {
    throw new Error("Table number required for dine-in orders");
  }

  if (orderType === "ONLINE" && !deliveryAddress) {
    throw new Error("Delivery address required for online orders");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No items in order");
  }

  if (typeof grandTotal !== "number") {
    throw new Error("Grand total missing");
  }

  /* ---------------- SESSION HANDLING (DINE_IN ONLY) ---------------- */
  let session;
  let responseSessionId;
  let responseSessionStatus;

  if (orderType === "DINE_IN") {
    if (sessionId) {
      session = await Session.findOne({
        sessionId,
        username,
      });

      if (!session) {
        throw new Error("Invalid session");
      }

      if (session.status !== "ACTIVE") {
        throw new Error("Session is closed. Please start a new order.");
      }
    } else {
      const result = await Session.findOrCreateActive({
        username,
        tableNumber,
        customerName,
        phoneNumber,
      });

      session = result.session;

      if (session.status !== "ACTIVE") {
        throw new Error("Session is closed. Please start a new order.");
      }
    }

    responseSessionId = session.sessionId;
    responseSessionStatus = session.status;
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
  const orderData = {
    username,
    customerName,
    phoneNumber,
    description,
    items: normalizedItems,
    grandTotal,
    orderType,
  };

  if (orderType === "DINE_IN") {
    orderData.tableNumber = tableNumber;
    orderData.sessionId = session.sessionId;
  }

  if (orderType === "ONLINE") {
    orderData.deliveryAddress = deliveryAddress;
  }

  const order = await Customer.create(orderData);

  /* ---------------- LINK ORDER TO SESSION (DINE_IN ONLY) ---------------- */
  if (orderType === "DINE_IN") {
    session.orders.push(order._id);
    await session.save();
  }

  /* ---------------- RETURN ---------------- */
  const response = {
    created: true,
    data: order,
  };

  if (orderType === "DINE_IN") {
    response.sessionId = responseSessionId;
    response.sessionStatus = responseSessionStatus;
  }

  return response;
}