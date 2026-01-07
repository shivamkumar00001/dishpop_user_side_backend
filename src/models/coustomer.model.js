import mongoose from "mongoose";

const Schema = mongoose.Schema;

/* ---------- Addons ---------- */
const AddonSchema = new Schema(
  {
    id: String,
    name: String,
    price: Number,
  },
  { _id: false }
);

/* ---------- Variants ---------- */
const VariantSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

/* ---------- Items ---------- */
const ItemSchema = new Schema(
  {
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    imageUrl: String,

    qty: { type: Number, required: true },

    variant: { type: VariantSchema, required: true },

    addons: { type: [AddonSchema], default: [] },

    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: false }
);

/* ---------- Customer (Order Request) ---------- */
const CustomerSchema = new Schema(
  {
    // Restaurant identifier
    username: { type: String, required: true },

    // Table info
    tableNumber: { type: Number, required: true },

    // Session identifier (NEW – minimal & required for your flow)
    // Same for first order + all add-on orders
    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    // Customer details
    customerName: { type: String, required: true },
    phoneNumber: String,
    description: String,

    // ONLY newly ordered items (first order or add-on)
    items: { type: [ItemSchema], required: true },

    // Kept EXACTLY as-is (used on user side)
    grandTotal: { type: Number, required: true },

    // Kept EXACTLY as-is
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "completed", "cancelled"],
    },

    createdAt: {
      type: Date,
      default: Date.now,
      // ❌ expiry REMOVED (session is bill-driven)
    },
  },
  { versionKey: false }
);

/* Indexes for restaurant-side grouping */
CustomerSchema.index({ username: 1, sessionId: 1 });
CustomerSchema.index({ username: 1, tableNumber: 1 });

export default mongoose.model("Customer", CustomerSchema);
