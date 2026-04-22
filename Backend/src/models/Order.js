const mongoose = require("mongoose");

const {
  ORDER_STATUSES,
  DELIVERY_STATUSES,
  PAYMENT_STATUSES
} = require("../constants/statuses");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: String,
    image: String,
    category: String,
    quantity: Number,
    unitPrice: Number
  },
  { _id: false }
);

const statusEntrySchema = new mongoose.Schema(
  {
    label: String,
    note: String,
    byRole: String,
    at: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    items: {
      type: [orderItemSchema],
      required: true
    },
    orderStatus: {
      type: String,
      enum: Object.values(ORDER_STATUSES),
      default: ORDER_STATUSES.PENDING
    },
    deliveryStatus: {
      type: String,
      enum: Object.values(DELIVERY_STATUSES),
      default: DELIVERY_STATUSES.PENDING_ASSIGNMENT
    },
    customerDecision: {
      type: String,
      enum: ["Pending", "Accepted", "Returned"],
      default: "Pending"
    },
    deliveryAddress: {
      type: String,
      required: true
    },
    payment: {
      amount: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        default: "INR"
      },
      status: {
        type: String,
        enum: Object.values(PAYMENT_STATUSES),
        default: PAYMENT_STATUSES.AUTHORIZED
      },
      transactionRef: {
        type: String,
        required: true
      }
    },
    otp: {
      code: String,
      expiresAt: Date,
      verifiedAt: Date
    },
    trialEndsAt: Date,
    statusHistory: {
      type: [statusEntrySchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);
