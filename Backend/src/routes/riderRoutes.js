const express = require("express");

const {
  getDashboard,
  updateDeliveryStatus,
  verifyDeliveryOtp,
  confirmCustomerDecision
} = require("../controllers/riderController");
const { protect, authorize } = require("../middleware/authMiddleware");
const ROLES = require("../constants/roles");

const router = express.Router();

router.use(protect, authorize(ROLES.RIDER));
router.get("/dashboard", getDashboard);
router.patch("/orders/:orderId/status", updateDeliveryStatus);
router.patch("/orders/:orderId/verify-otp", verifyDeliveryOtp);
router.patch("/orders/:orderId/decision", confirmCustomerDecision);

module.exports = router;
