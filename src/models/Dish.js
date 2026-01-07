import mongoose from "mongoose";

/* ===============================
   VARIANT SUB-SCHEMA
================================ */
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

/* ===============================
   DISH SCHEMA
================================ */
const DishSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    foodType: {
      type: String,
      enum: ["veg", "non-veg", "egg"],
      required: true,
    },

    variants: {
      type: [VariantSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one variant is required",
      },
    },

    addOnGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AddOnGroup",
      },
    ],

    /* ✅ TAG KEYS (ADDED) */
    tags: [
      {
        type: String,
        enum: [
          "chef-special",
          "most-loved",
          "trending",
          "dish-of-the-day",
          "romantic-dining",
          "spicy",
          "best-seller",
          "new-arrival",
          "seasonal",
          "signature",
        ],
        index: true,
      },
    ],

    imageUrl: String,
    thumbnailUrl: String,

    /* ✅ AR MODEL SUPPORT */
    arModel: {
      glb: String,
      usdz: String,
      isAvailable: {
        type: Boolean,
        default: false,
      },
    },

    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },

    popularityScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ===============================
   INDEXES
================================ */
DishSchema.index({ username: 1, categoryId: 1 });
DishSchema.index({ username: 1, tags: 1 });

/* ===============================
   TAG VIRTUAL (🔥 REQUIRED FOR populate)
================================ */
DishSchema.virtual("tagDetails", {
  ref: "Tag",
  localField: "tags",
  foreignField: "key",
  justOne: false,
});

/* 🔥 ENABLE VIRTUALS */
DishSchema.set("toObject", { virtuals: true });
DishSchema.set("toJSON", { virtuals: true });

/* ===============================
   SAFE EXPORT (NO OVERWRITE ERROR)
================================ */
const Dish =
  mongoose.models.Dish ||
  mongoose.model("Dish", DishSchema);

export default Dish;
