import express from "express";
import menuRoutes from "./routes/menu.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import ownerRoutes from "./routes/owner.routes.js";
import reviewRoutes from "./routes/review.route.js";
import arRoutes from "./routes/ar.routes.js"; 
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

app.use("/api/menu", menuRoutes);

app.use("/api/checkout", checkoutRoutes);

app.use("/api/ar", arRoutes);

app.use("/api/review", reviewRoutes);

app.use("/api/owner", ownerRoutes);

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
