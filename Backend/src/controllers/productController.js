const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/appError");

const getProducts = asyncHandler(async (req, res) => {
  const { search = "", category = "" } = req.query;
  const query = {
    isActive: true
  };

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  const products = await Product.find(query)
    .populate("vendor", "name shopName")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    products
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId).populate(
    "vendor",
    "name shopName phone"
  );

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.json({
    success: true,
    product
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    images = [],
    category = "General",
    inventoryCount = 0
  } = req.body;

  const normalizedImages = Array.isArray(images)
    ? images
    : String(images)
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

  const product = await Product.create({
    name,
    description,
    price,
    images: normalizedImages,
    category,
    inventoryCount,
    vendor: req.user._id
  });

  res.status(201).json({
    success: true,
    message: "Product created",
    product
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.productId,
    vendor: req.user._id
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const updates = req.body;
  if (updates.images && !Array.isArray(updates.images)) {
    updates.images = String(updates.images)
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }

  Object.assign(product, updates);
  await product.save();

  res.json({
    success: true,
    message: "Product updated",
    product
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.productId,
    vendor: req.user._id
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: "Product deleted"
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
