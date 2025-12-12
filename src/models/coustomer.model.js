import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    username: { type: String, required: true },
    tableNumber: { type: Number, required: true },

    customerName: { type: String, required: true }, 
    phoneNumber: { type: String },
    description: { type: String },

    // Items customer ordered (same structure as OrderSchema)
    items: [
      {
        itemId: String,
        name: String,
        qty: Number,
        price: Number,
        imageUrl: String
      }
    ],

    status: { type: String, default: "pending" },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 
    }
  },
  {
    versionKey: false
  }
);

// Important index for restaurant + table
CustomerSchema.index({ username: 1, tableNumber: 1 });

const CustomerModel = mongoose.model("Customer", CustomerSchema);

export default CustomerModel;
