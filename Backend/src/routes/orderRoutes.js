const express = require("express");

const {
  placeTryBuyOrder,
  getUserOrders,
  updateCustomerDecision
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");
const ROLES = require("../constants/roles");

const router = express.Router();

router.use(protect, authorize(ROLES.USER));
router.post("/", placeTryBuyOrder);
router.get("/", getUserOrders);
router.patch("/:orderId/decision", updateCustomerDecision);

module.exports = router;
