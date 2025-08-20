import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      name: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String,
    },
    deliveryOption: {
      type: String,
      enum: ["standard", "express", "same-day"],
      default: "standard",
    },
    paymentMethod: {
      type: String,
      default: "Credit Card",
    },
    paymentIntentId: {
      type: String,
    },
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
    orderNumber: {
      type: String,
      unique: true,
    },
    trackingNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber =
      "AMZ" +
      Date.now() +
      Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  if (!this.trackingNumber && this.status === "shipped") {
    this.trackingNumber =
      "1Z" + Math.random().toString(36).substr(2, 12).toUpperCase();
  }
  next();
});

export default mongoose.model("Order", orderSchema);
