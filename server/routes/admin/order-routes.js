const express = require("express");
const { authMiddleware, requireAdmin } = require("../../controllers/auth/auth-middleware");
const {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller");

const router = express.Router();
router.use(authMiddleware, requireAdmin);

router.get("/get", getAllOrdersForAdmin);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;
