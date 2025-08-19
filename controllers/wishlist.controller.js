import Wishlist from "../models/wishlist.js";

export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }

    res.json(wishlist);
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }

    const itemExists = wishlist.items.some(
      (item) => item.productId === productId
    );

    if (itemExists) {
      return res.status(400).json({ message: "Item already in wishlist" });
    }

    wishlist.items.push({ productId });
    await wishlist.save();

    res.json({
      success: true,
      message: "Item added to wishlist successfully",
      wishlist,
    });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const initialLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter(
      (item) => item.productId !== productId
    );

    if (wishlist.items.length === initialLength) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    await wishlist.save();

    res.json({
      success: true,
      message: "Item removed from wishlist successfully",
      wishlist,
    });
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
