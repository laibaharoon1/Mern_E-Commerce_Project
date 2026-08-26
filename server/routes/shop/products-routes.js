const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

// Route to get products with filters and sorting
router.get("/get", getFilteredProducts);

// Route to get a single product's details (for the Quick View modal)
router.get("/get/:id", getProductDetails);

module.exports = router;