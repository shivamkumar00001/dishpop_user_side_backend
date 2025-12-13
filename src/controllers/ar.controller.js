import ARStatistics from "../models/arstatistics.model.js";
import { io } from "../server.js"; // import io to emit events

export const incrementAR = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { itemName, imageUrl } = req.body;

    if (!restaurantId || !itemName || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "username, itemName and imageUrl are required",
      });
    }

    // Today's date in Asia/Kolkata
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    // Increment clicks or create record for today
    const stat = await ARStatistics.findOneAndUpdate(
      { restaurantId, itemName, date: today },
      { $inc: { clicks: 1 }, imageUrl },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // 🔥 Emit live update to all connected dashboards
    io.emit("ar-updated", {
      restaurantId,
      itemName,
      imageUrl,
      clicks: stat.clicks,
      date: today,
    });

    return res.json({ success: true, stat });
  } catch (error) {
    console.error("AR Increment Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
