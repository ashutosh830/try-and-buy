const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
} = require("../controllers/cartController");
const { protect, authorize } = require("../middleware/authMiddleware");
const ROLES = require("../constants/roles");

const router = express.Router();

router.use(protect, authorize(ROLES.USER));
router.get("/", getCart);
router.post("/", addToCart);
router.patch("/:productId", updateCartItem);
router.delete("/:productId", removeCartItem);

module.exports = router;
