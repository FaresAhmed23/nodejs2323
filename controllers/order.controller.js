import Order from "../models/order.js";
import Cart from "../models/cart.js";
import {
  createFakePayment,
  confirmFakePayment,
} from "../services/stripe.service.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { shippingAddress, deliveryOption = "standard" } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate totals
    let itemsTotal = 0;
    const enrichedItems = [];

    for (let item of cart.items) {
      // Using a base price for demo - in production you'd fetch real prices
      const productPrice = 29.99;
      const itemTotal = productPrice * item.quantity;
      itemsTotal += itemTotal;

      enrichedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: productPrice,
        total: itemTotal,
      });
    }

    // Calculate shipping
    const shippingCost =
      deliveryOption === "express"
        ? 9.99
        : deliveryOption === "same-day"
        ? 19.99
        : 0;

    // Calculate tax (8%)
    const taxRate = 0.08;
    const taxAmount = itemsTotal * taxRate;
    const totalAmount = itemsTotal + shippingCost + taxAmount;

    // Create fake payment intent
    const fakePayment = await createFakePayment(totalAmount, "usd");

    const checkoutSession = {
      paymentIntentId: fakePayment.id,
      clientSecret: `${fakePayment.id}_secret_fake`,
      user: req.user._id,
      items: enrichedItems,
      shippingAddress,
      deliveryOption,
      pricing: {
        itemsTotal: itemsTotal.toFixed(2),
        shipping: shippingCost.toFixed(2),
        tax: taxAmount.toFixed(2),
        total: totalAmount.toFixed(2),
      },
    };

    res.json({
      success: true,
      checkoutSession,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Checkout failed", error: error.message });
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const { paymentIntentId, shippingAddress, deliveryOption } = req.body;

    // Fake payment confirmation
    const fakePayment = await confirmFakePayment(paymentIntentId);

    if (fakePayment.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total price
    let totalPrice = 0;
    for (let item of cart.items) {
      totalPrice += 29.99 * item.quantity; // Using base price for demo
    }

    // Add shipping cost
    const shippingCost =
      deliveryOption === "express"
        ? 9.99
        : deliveryOption === "same-day"
        ? 19.99
        : 0;
    const tax = totalPrice * 0.08;
    totalPrice = totalPrice + shippingCost + tax;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: cart.items,
      totalPrice,
      shippingAddress,
      deliveryOption,
      paymentIntentId: fakePayment.id,
      status: "confirmed",
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: "Order confirmed successfully",
      order,
    });
  } catch (error) {
    console.error("Order confirmation error:", error);
    res.status(500).json({ message: "Order confirmation failed" });
  }
};

// Simplified checkout
export const checkout = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = "Credit Card" } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalPrice = 0;
    for (let item of cart.items) {
      totalPrice += 29.99 * item.quantity;
    }

    // Add tax
    totalPrice = totalPrice + totalPrice * 0.08;

    const order = await Order.create({
      user: req.user._id,
      items: cart.items,
      totalPrice,
      shippingAddress: shippingAddress || {
        street: "123 Main St",
        city: "Sample City",
        state: "Sample State",
        zipCode: "12345",
        country: "Sample Country",
      },
      paymentMethod,
      status: "confirmed",
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Checkout failed" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Server error" });
  }
};
