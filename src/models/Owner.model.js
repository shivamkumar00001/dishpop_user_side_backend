import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9._]+$/,
      index: true,
    },

    restaurantName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    state: String,
    city: String,
    pincode: String,
    restaurantType: String,
    description: String,

    profilePhoto: { type: String, default: null },

    accountVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "owners", // 🔥 CRITICAL: match existing collection
  }
);

const Owner = mongoose.model("Owner", ownerSchema);
export default Owner;
