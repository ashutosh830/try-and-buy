const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/appError");
const {
  ORDER_STATUSES,
  DELIVERY_STATUSES,
  PAYMENT_STATUSES
} = require("../constants/statuses");
const {
  capturePayment,
  voidPayment
} = require("../services/paymentService");

function buildHistory(label, note, byRole) {
  return {
    label,
    note,
    byRole,
    at: new Date()
  };
}

const getDashboard = asyncHandler(async (req, res) => {
  const orders = await Order.find({ rider: req.user._id })
    .populate("user", "name phone address")
    .populate("vendor", "name shopName")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    orders
  });
});

const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { deliveryStatus } = req.body;
  const order = await Order.findOne({
    _id: req.params.orderId,
    rider: req.user._id
  });

  if (!order) {
    throw new AppError("Assigned order not found", 404);
  }

  const allowedStatuses = [
    DELIVERY_STATUSES.PICKED,
    DELIVERY_STATUSES.OUT_FOR_DELIVERY,
    DELIVERY_STATUSES.AT_CUSTOMER_LOCATION
  ];

  if (!allowedStatuses.includes(deliveryStatus)) {
    throw new AppError("Invalid delivery status", 400);
  }

  order.deliveryStatus = deliveryStatus;
  order.statusHistory.push(
    buildHistory(deliveryStatus, `Rider updated status to ${deliveryStatus}`, req.user.role)
  );
  await order.save();

  res.json({
    success: true,
    message: "Delivery status updated",
    order
  });
});

const verifyDeliveryOtp = asyncHandler(async (req, res) => {
  const otp = String(req.body.otp || "").trim();
  const order = await Order.findOne({
    _id: req.params.orderId,
    rider: req.user._id
  });

  if (!order) {
    throw new AppError("Assigned order not found", 404);
  }

  if (!otp) {
    throw new AppError("OTP is required", 400);
  }

  if (order.orderStatus !== ORDER_STATUSES.PENDING) {
    throw new AppError("OTP can only be verified for pending deliveries", 400);
  }

  if (order.deliveryStatus !== DELIVERY_STATUSES.AT_CUSTOMER_LOCATION) {
    throw new AppError("Reach the customer location before verifying OTP", 400);
  }

  if (order.otp?.verifiedAt) {
    throw new AppError("OTP has already been verified for this order", 400);
  }

  if (!order.otp || order.otp.code !== otp) {
    throw new AppError("Invalid OTP", 400);
  }

  if (order.otp.expiresAt && order.otp.expiresAt < new Date()) {
    throw new AppError("OTP expired", 400);
  }

  order.otp.verifiedAt = new Date();
  order.deliveryStatus = DELIVERY_STATUSES.DELIVERED;
  order.orderStatus = ORDER_STATUSES.OUT_FOR_TRIAL;
  order.trialEndsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  order.statusHistory.push(
    buildHistory(
      DELIVERY_STATUSES.DELIVERED,
      "Order delivered to the customer after OTP verification",
      req.user.role
    )
  );
  order.statusHistory.push(
    buildHistory(
      "Out for Trial",
      "Delivery OTP verified and customer started the trial window",
      req.user.role
    )
  );
  await order.save();

  res.json({
    success: true,
    message: "Delivery verified and trial started",
    order
  });
});

const confirmCustomerDecision = asyncHandler(async (req, res) => {
  const { decision } = req.body;
  const order = await Order.findOne({
    _id: req.params.orderId,
    rider: req.user._id
  });

  if (!order) {
    throw new AppError("Assigned order not found", 404);
  }

  if (order.orderStatus !== ORDER_STATUSES.OUT_FOR_TRIAL) {
    throw new AppError("Customer decision can only be recorded during trial", 400);
  }

  if (!order.otp?.verifiedAt) {
    throw new AppError("Verify the delivery OTP before recording the customer decision", 400);
  }

  if (decision === "Accepted") {
    const payment = await capturePayment(order.payment.transactionRef);
    order.orderStatus = ORDER_STATUSES.ACCEPTED;
    order.customerDecision = "Accepted";
    order.payment.status = payment.status;
  } else if (decision === "Returned") {
    const payment = await voidPayment(order.payment.transactionRef);
    order.orderStatus = ORDER_STATUSES.RETURNED;
    order.customerDecision = "Returned";
    order.payment.status = payment.status;

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { inventoryCount: item.quantity }
      });
    }
  } else {
    throw new AppError("Decision must be Accepted or Returned", 400);
  }

  order.statusHistory.push(
    buildHistory(order.orderStatus, `Rider confirmed customer decision: ${decision}`, req.user.role)
  );
  await order.save();

  res.json({
    success: true,
    message: "Customer decision confirmed",
    order
  });
});

module.exports = {
  getDashboard,
  updateDeliveryStatus,
  verifyDeliveryOtp,
  confirmCustomerDecision
};
