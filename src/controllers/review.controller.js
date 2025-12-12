// controllers/review.controller.js
import Review from "../models/Review.js";
import mongoose from "mongoose";

export const createReview = async (req, res) => {
  try {
    const { username } = req.params;
    const { rating, review, userName, orderId } = req.body;

    // basic validation
    if (!rating || ![1,2,3,4,5].includes(Number(rating))) {
      return res.status(400).json({ success: false, message: "Invalid rating (1-5)." });
    }

    // i have to fix this 


    //##########################



    // if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    //   return res.status(400).json({ success: false, message: "Invalid restaurant id." });
    // }

    //############
    const doc = await Review.create({
      username,
      rating: Number(rating),
      review: review || "",
      userName: userName || null,
      orderId: orderId || null
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("createReview error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getReviewsWithStats = async (req, res) => {
  try {
    const { username } = req.params;
    // if (!mongoose.isValid(restaurantId)) {
    //   return res.status(400).json({ success: false, message: "Invalid restaurant id." });
    // }

    // aggregation to get reviews + avg rating + count
    const agg = await Review.aggregate([
      { $match: { username:username } },
      {
        $group: {
          _id: "$username",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = agg[0] || { avgRating: 0, count: 0 };

    // fetch recent reviews (pageable in future)
    const reviews = await Review.find({ username })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json({ success: true, data: { stats, reviews } });
  } catch (err) {
    console.error("getReviewsWithStats error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
