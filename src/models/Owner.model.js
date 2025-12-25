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
          enum: [
            "NOT_SUBSCRIBED",
            "PENDING_AUTH",
            "TRIALING",
            "ACTIVE",
            "CANCELLED",
            "EXPIRED"
          ],
          default: "NOT_SUBSCRIBED",
        },

        plan: {
          type: String,
          enum: ["MONTHLY", "QUARTERLY", "YEARLY"],
          default: null,
        },

        razorpayCustomerId: {
          type: String,
          default: null,
        },

        razorpaySubscriptionId: {
          type: String,
          default: null,
        },

        trialStart: {
          type: Date,
          default: null,
        },

        trialEnd: {
          type: Date,
          default: null,
        },

        subscribedAt: {
          type: Date,
          default: null,
        },

        currentPeriodEnd: {
          type: Date,
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
