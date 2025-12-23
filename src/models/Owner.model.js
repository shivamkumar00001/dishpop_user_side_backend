import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
  {
    /* ---------------- BASIC INFO ---------------- */
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

    profilePhoto: {
      type: String,
      default: null,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔐 do not expose accidentally
    },

    accountVerified: {
      type: Boolean,
      default: false,
    },

    /* ---------------- SUBSCRIPTION INFO ---------------- */
    subscription: {
      status: {
        type: String,
        enum: ["active", "inactive", "pending"],
        default: "inactive",
      },

      trial_end: {
        type: Date,
        default: null,
      },

      current_period_end: {
        type: Date,
        default: null,
      },

      razorpay_customer_id: {
        type: String,
        default: null,
      },

      razorpay_subscription_id: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
    collection: "owners", // 🔥 KEEP THIS
  }
);

const Owner = mongoose.model("Owner", ownerSchema);
export default Owner;
