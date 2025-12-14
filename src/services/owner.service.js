import Owner from "../models/Owner.model.js";

class OwnerService {
  async getRestaurantByUsername(username) {
    const owner = await Owner.findOne({ username }).select("restaurantName");

    if (!owner) {
      return null;
    }

    return owner;
  }
}

const ownerService = new OwnerService();
export default ownerService;
