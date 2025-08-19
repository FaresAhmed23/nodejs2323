import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: String,
        quantity: Number,
        price: { type: Number, default: 0 },
      },
    ],
    totalPrice: Number,
    shippingAddress: {
      name: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: "Egypt" },
    },
    deliveryOption: {
      type: String,
      enum: ["standard", "express", "same-day"],
      default: "standard",
    },
    paymentMethod: { type: String, default: "card" },
    paymentIntentId: String,
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    trackingNumber: String,
    estimatedDelivery: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
