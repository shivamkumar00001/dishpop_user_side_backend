// models/Review.js
import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const reviewSchema = new Schema({
  username: { type: String, required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, trim: true, default: "" },
  userName: { type: String, trim: true },      // optional
  createdAt: { type: Date, default: Date.now }
});

// optional compound index for read patterns (restaurant + createdAt)
reviewSchema.index({ username: 1, createdAt: -1 });

export default model("Review", reviewSchema);
