import CustomerModel from "../models/coustomer.model.js";

class CheckoutService {
  async createOrder(data) {
    try {
      const {
        restaurantId,
        tableNumber,
        customerName,
        phoneNumber,
        description,
        items
      } = data;

      // Find existing order for table
      const existingOrder = await CustomerModel.findOne({
        restaurantId,
        tableNumber
      });

      if (existingOrder) {

        // Compare only customer name (phone optional)
        const isSameCustomer =
          existingOrder.customerName === customerName;

        // SAME CUSTOMER → UPDATE
        if (isSameCustomer) {
          const updatedOrder = await CustomerModel.findByIdAndUpdate(
            existingOrder._id,
            {
              description,
              items,
              status: "pending",
            },
            { new: true }
          );

          return {
            allowed: true,
            updated: true,
            message: "Order updated for the same customer.",
            data: updatedOrder
          };
        }

        // DIFFERENT CUSTOMER → delete old order
        await CustomerModel.findByIdAndDelete(existingOrder._id);

        const newOrder = await CustomerModel.create(data);

        return {
          allowed: true,
          replaced: true,
          message: "Old order removed & new one created.",
          data: newOrder
        };
      }

      // No existing order → create new
      const newOrder = await CustomerModel.create(data);

      return {
        allowed: true,
        created: true,
        message: "New order created successfully.",
        data: newOrder
      };

    } catch (error) {
      throw new Error("Failed to process order: " + error.message);
    }
  }
}

export default new CheckoutService();
