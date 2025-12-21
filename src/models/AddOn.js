import mongoose from "mongoose";

const AddOnSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("AddOn", AddOnSchema);
