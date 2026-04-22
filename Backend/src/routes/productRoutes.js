const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");
const ROLES = require("../constants/roles");

const router = express.Router();

router.get("/", getProducts);
router.get("/:productId", getProductById);
router.post("/", protect, authorize(ROLES.VENDOR, ROLES.ADMIN), createProduct);
router.put("/:productId", protect, authorize(ROLES.VENDOR, ROLES.ADMIN), updateProduct);
router.delete("/:productId", protect, authorize(ROLES.VENDOR, ROLES.ADMIN), deleteProduct);

module.exports = router;
