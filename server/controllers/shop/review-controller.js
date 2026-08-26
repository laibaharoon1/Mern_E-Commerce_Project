const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, reviewMessage, reviewValue } = req.body;
    const userId = String(req.user.id);
    const userName = req.user.username;
    if (!productId || !Number.isFinite(Number(reviewValue)) || Number(reviewValue) < 1 || Number(reviewValue) > 5) {
      return res.status(400).json({ success: false, message: "A rating between 1 and 5 is required" });
    }

    // Optional: Check if the user actually bought the product before letting them review
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: "confirmed", // or "delivered"
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase this product to review it.",
      });
    }

    const checkExistingReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue: Number(reviewValue),
    });

    await newReview.save();

    // Update product average rating
    const reviews = await ProductReview.find({ productId });
    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, item) => sum + item.reviewValue, 0) / totalReviews;

    await Product.findByIdAndUpdate(productId, { averageRating });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error adding review",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ProductReview.find({ productId });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
    });
  }
};

module.exports = { addProductReview, getProductReviews };
