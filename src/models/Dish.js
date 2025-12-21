import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    unit: {
      type: String,
      enum: ["g", "kg", "ml", "l", "piece", "plate"],
      required: true,
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const DishSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: true },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true },
    description: String,

    foodType: {
      type: String,
      enum: ["veg", "non-veg", "egg"],
      required: true,
    },

    variants: { type: [VariantSchema], validate: (v) => v.length > 0 },

    addOnGroups: [
      { type: mongoose.Schema.Types.ObjectId, ref: "AddOnGroup" },
    ],

    imageUrl: String,
    thumbnailUrl: String,

    isAvailable: { type: Boolean, default: true },
    popularityScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

DishSchema.index({ username: 1, categoryId: 1 });

export default mongoose.model("Dish", DishSchema);
