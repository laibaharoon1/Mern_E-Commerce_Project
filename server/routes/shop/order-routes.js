const express = require("express");
const { createOrder, capturePayment, getOrdersByUser, getOrderDetails } = require("../../controllers/shop/order-controller");
const { authMiddleware } = require("../../controllers/auth/auth-middleware");
const router = express.Router();

router.use(authMiddleware);
router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list", getOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;
