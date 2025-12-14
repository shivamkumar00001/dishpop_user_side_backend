import ownerService from "../services/owner.service.js";

class OwnerController {
  async getRestaurantLanding(req, res) {
    console.log("HIT OWNER LANDING:", req.params);

    const { username } = req.params;

    const owner = await ownerService.getRestaurantByUsername(username);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.json({
      success: true,
      restaurantName: owner.restaurantName,
    });
  }
}

export default new OwnerController();
