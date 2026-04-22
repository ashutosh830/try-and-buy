const crypto = require("crypto");

function createReference(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

async function authorizePayment(amount) {
  return {
    status: "Authorized",
    amount,
    transactionRef: createReference("auth")
  };
}

async function capturePayment(transactionRef) {
  return {
    status: "Captured",
    transactionRef
  };
}

async function voidPayment(transactionRef) {
  return {
    status: "Voided",
    transactionRef
  };
}

module.exports = {
  authorizePayment,
  capturePayment,
  voidPayment
};
