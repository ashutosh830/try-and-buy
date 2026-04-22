const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/appError");
const { buildOtpPayload } = require("../services/otpService");
const {
  authorizePayment,
  capturePayment,
  voidPayment
} = require("../services/paymentService");
const { sendNotification } = require("../services/notificationService");
const {
  ORDER_STATUSES,
  DELIVERY_STATUSES,
  PAYMENT_STATUSES
} = require("../constants/statuses");

function buildHistory(label, note, byRole) {
  return {
    label,
    note,
    byRole,
    at: new Date()
  };
}

const placeTryBuyOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  const distinctVendorIds = [
    ...new Set(cart.items.map((item) => item.product.vendor.toString()))
  ];

  if (distinctVendorIds.length !== 1) {
    throw new AppError(
      "Checkout currently supports products from one vendor at a time",
      400
    );
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const cartItem of cart.items) {
    const product = await Product.findById(cartItem.product._id);

    if (!product || !product.isActive) {
      throw new AppError(`Product unavailable: ${cartItem.product.name}`, 400);
    }

    if (product.inventoryCount < cartItem.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    product.inventoryCount -= cartItem.quantity;
    await product.save();

    totalAmount += product.price * cartItem.quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || "",
      category: product.category,
      quantity: cartItem.quantity,
      unitPrice: product.price
    });
  }

  const payment = await authorizePayment(totalAmount);
  const otp = buildOtpPayload();

  const order = await Order.create({
    user: req.user._id,
    vendor: distinctVendorIds[0],
    items: orderItems,
    deliveryAddress: req.body.deliveryAddress || req.user.address,
    payment: {
      amount: payment.amount,
      status: payment.status,
      transactionRef: payment.transactionRef
    },
    otp,
    statusHistory: [
      buildHistory("Pending", "Try & Buy order placed", req.user.role)
    ]
  });

  cart.items = [];
  await cart.save();

  await sendNotification({
    channel: "email",
    to: req.user.email,
    subject: "Try & Buy order placed",
    message: `Your order ${order._id} has been placed. OTP: ${otp.code}`
  });

  res.status(201).json({
    success: true,
    message: "Try & Buy order placed",
    order
  });
});

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("vendor", "name shopName phone")
    .populate("rider", "name phone")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    orders
  });
});

const updateCustomerDecision = asyncHandler(async (req, res) => {
  const { decision } = req.body;
  const order = await Order.findOne({
    _id: req.params.orderId,
    user: req.user._id
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.orderStatus !== ORDER_STATUSES.OUT_FOR_TRIAL) {
    throw new AppError("Order is not in trial phase", 400);
  }

  if (decision === "accept") {
    const payment = await capturePayment(order.payment.transactionRef);
    order.orderStatus = ORDER_STATUSES.ACCEPTED;
    order.customerDecision = "Accepted";
    order.payment.status = payment.status;
    order.statusHistory.push(
      buildHistory("Accepted", "Customer accepted the product", req.user.role)
    );
  } else if (decision === "return") {
    const payment = await voidPayment(order.payment.transactionRef);
    order.orderStatus = ORDER_STATUSES.RETURNED;
    order.customerDecision = "Returned";
    order.payment.status = payment.status;
    order.statusHistory.push(
      buildHistory("Returned", "Customer returned the product", req.user.role)
    );

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { inventoryCount: item.quantity }
      });
    }
  } else {
    throw new AppError("Decision must be accept or return", 400);
  }

  await order.save();

  res.json({
    success: true,
    message: "Decision recorded",
    order
  });
});

module.exports = {
  placeTryBuyOrder,
  getUserOrders,
  updateCustomerDecision
};
