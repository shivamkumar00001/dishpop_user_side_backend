import Customer from "../models/coustomer.model.js";

class CheckoutService {
  async createOrder(data) {
    const { username, tableNumber, customerName, phoneNumber, description, items } = data;

    if (!username) throw new Error("Invalid restaurant");
    if (!customerName) throw new Error("Customer name required");

    const table = Number(tableNumber);
    if (!Number.isInteger(table) || table <= 0)
      throw new Error("Invalid table number");

    if (!Array.isArray(items) || items.length === 0)
      throw new Error("Cart is empty");

    const payload = {
      username,
      tableNumber: table,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber || "",
      description: description || "",
      items: items.map(i => ({
        itemId: String(i.itemId),
        name: String(i.name),
        qty: Number(i.qty),
        price: Number(i.price),
        imageUrl: i.imageUrl || ""
      }))
    };

    const existing = await Customer.findOne({ username, tableNumber: table });

    if (!existing)
      return { created: true, data: await Customer.create(payload) };

    if (existing.customerName === payload.customerName) {
      await Customer.updateOne({ _id: existing._id }, { $set: payload });
      return { updated: true, data: await Customer.findById(existing._id) };
    }

    await Customer.deleteOne({ _id: existing._id });
    return { replaced: true, data: await Customer.create(payload) };
  }
}

export default new CheckoutService();
