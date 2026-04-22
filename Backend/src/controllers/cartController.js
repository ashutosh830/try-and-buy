const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/appError");

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: []
    });
    cart = await Cart.findOne({ user: userId }).populate("items.product");
  }

  return cart;
}

const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);

  res.json({
    success: true,
    cart
  });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new AppError("Product not available", 404);
  }

  if (product.inventoryCount < quantity) {
    throw new AppError("Insufficient inventory", 400);
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find(
    (item) => item.product._id.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity);
    existingItem.priceAtAdd = product.price;
  } else {
    cart.items.push({
      product: product._id,
      quantity: Number(quantity),
      priceAtAdd: product.price
    });
  }

  await cart.save();
  await cart.populate("items.product");

  res.json({
    success: true,
    message: "Product added to cart",
    cart
  });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find(
    (entry) => entry.product._id.toString() === req.params.productId
  );

  if (!item) {
    throw new AppError("Cart item not found", 404);
  }

  if (Number(quantity) <= 0) {
    cart.items = cart.items.filter(
      (entry) => entry.product._id.toString() !== req.params.productId
    );
  } else {
    item.quantity = Number(quantity);
  }

  await cart.save();
  await cart.populate("items.product");

  res.json({
    success: true,
    message: "Cart updated",
    cart
  });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter(
    (entry) => entry.product._id.toString() !== req.params.productId
  );
  await cart.save();
  await cart.populate("items.product");

  res.json({
    success: true,
    message: "Item removed from cart",
    cart
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
};
