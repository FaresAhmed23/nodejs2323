import Cart from "../models/cart.js";

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    if (quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex >= 0) {
      // Update existing item quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    res.json({
      success: true,
      message: "Item added to cart successfully",
      cart,
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.productId !== productId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cart.save();

    res.json({
      success: true,
      message: "Item removed from cart successfully",
      cart,
    });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    if (quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex < 0) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.json({
      success: true,
      message: "Cart item quantity updated successfully",
      cart,
    });
  } catch (err) {
    console.error("Error updating cart item quantity:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
