// routes/review.routes.js
import express from "express";
import { createReview, getReviewsWithStats } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/:username", createReview);
router.get("/:username", getReviewsWithStats);

export default router;
