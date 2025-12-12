import mongoose from "mongoose";

const { Schema } = mongoose;

const ARStatisticsSchema = new Schema(
  {
    restaurantId: { type: String, required: true },

    // removed itemId
    itemName: { type: String, required: true },
    imageUrl: { type: String, required: true },

    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },

    clicks: { type: Number, default: 0 },

    // TTL FIELD — MongoDB will delete after 7 days
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false } // we manage createdAt manually
);

// UNIQUE per restaurant + itemName + date
ARStatisticsSchema.index(
  { restaurantId: 1, itemName: 1, date: 1 },
  { unique: true }
);

// TTL INDEX: deletes automatically after 7 days
ARStatisticsSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 } // 7 days
);

export default mongoose.model("ARStatistics", ARStatisticsSchema);
