import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: String,
    icon: { type: String, default: "🍽️" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CategorySchema.index({ username: 1, isActive: 1 });
CategorySchema.index({ username: 1, order: 1 });

export default mongoose.model("Category", CategorySchema);
