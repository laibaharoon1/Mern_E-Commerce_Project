const express = require("express");
const { authMiddleware, requireAdmin } = require("../../controllers/auth/auth-middleware");
const {
  addFeatureImage,
  getFeatureImages,
} = require("../../controllers/common/feature-controller");

const router = express.Router();

router.post("/add", authMiddleware, requireAdmin, addFeatureImage);
router.get("/get", getFeatureImages);

module.exports = router;
