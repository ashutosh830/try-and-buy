const express = require("express");

const {
  getDashboard,
  assignRider
} = require("../controllers/vendorController");
const { protect, authorize } = require("../middleware/authMiddleware");
const ROLES = require("../constants/roles");

const router = express.Router();

router.use(protect, authorize(ROLES.VENDOR, ROLES.ADMIN));
router.get("/dashboard", getDashboard);
router.patch("/orders/:orderId/assign-rider", assignRider);

module.exports = router;
