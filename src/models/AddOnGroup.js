import mongoose from "mongoose";

const AddOnGroupSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: true },
    name: { type: String, required: true },

    minSelection: { type: Number, default: 0 },
    maxSelection: { type: Number, default: 1 },
    required: { type: Boolean, default: false },

    addOns: [{ type: mongoose.Schema.Types.ObjectId, ref: "AddOn" }],

    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("AddOnGroup", AddOnGroupSchema);
