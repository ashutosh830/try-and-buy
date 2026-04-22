const ORDER_STATUSES = {
  PENDING: "Pending",
  OUT_FOR_TRIAL: "Out for Trial",
  DELIVERED: "Delivered",
  ACCEPTED: "Accepted",
  RETURNED: "Returned"
};

const DELIVERY_STATUSES = {
  PENDING_ASSIGNMENT: "Pending Assignment",
  ASSIGNED: "Assigned",
  PICKED: "Picked",
  OUT_FOR_DELIVERY: "Out for Delivery",
  AT_CUSTOMER_LOCATION: "At Customer Location",
  DELIVERED: "Delivered"
};

const PAYMENT_STATUSES = {
  AUTHORIZED: "Authorized",
  CAPTURED: "Captured",
  VOIDED: "Voided"
};

module.exports = {
  ORDER_STATUSES,
  DELIVERY_STATUSES,
  PAYMENT_STATUSES
};
