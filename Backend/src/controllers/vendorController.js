const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/appError");
const ROLES = require("../constants/roles");
const { DELIVERY_STATUSES } = require("../constants/statuses");
const { sendNotification } = require("../services/notificationService");

function buildHistory(label, note, byRole) {
  return {
    label,
    note,
    byRole,
    at: new Date()
  };
}

const getDashboard = asyncHandler(async (req, res) => {
  const [products, orders, riders] = await Promise.all([
    Product.find({ vendor: req.user._id }).sort({ createdAt: -1 }),
    Order.find({ vendor: req.user._id })
      .populate("user", "name phone address")
      .populate("rider", "name phone")
      .sort({ createdAt: -1 }),
    User.find({ role: ROLES.RIDER, isActive: true }).select("name phone vehicleNumber")
  ]);

  const inventorySummary = products.reduce(
    (summary, product) => summary + product.inventoryCount,
    0
  );

  res.json({
    success: true,
    dashboard: {
      products,
      orders,
      riders,
      stats: {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalInventory: inventorySummary
      }
    }
  });
});

const assignRider = asyncHandler(async (req, res) => {
  const { riderId } = req.body;

  const order = await Order.findOne({
    _id: req.params.orderId,
    vendor: req.user._id
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  const rider = await User.findOne({
    _id: riderId,
    role: ROLES.RIDER
  });

  if (!rider) {
    throw new AppError("Rider not found", 404);
  }

  order.rider = rider._id;
  order.deliveryStatus = DELIVERY_STATUSES.ASSIGNED;
  order.statusHistory.push(
    buildHistory("Assigned", `Rider ${rider.name} assigned`, req.user.role)
  );
  await order.save();

  await sendNotification({
    channel: "sms",
    to: rider.phone,
    subject: "New delivery assigned",
    message: `Order ${order._id} has been assigned to you`
  });

  res.json({
    success: true,
    message: "Rider assigned",
    order
  });
});

module.exports = {
  getDashboard,
  assignRider
};
