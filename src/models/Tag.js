import mongoose from "mongoose";

/* ===============================
   USER SIDE TAG MODEL
   (Read-only, predefined)
================================ */

const TagSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
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
    },

    name: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

/* ===============================
   SAFE EXPORT (NO OVERWRITE ERROR)
================================ */
const Tag =
  mongoose.models.Tag ||
  mongoose.model("Tag", TagSchema);

export default Tag;
