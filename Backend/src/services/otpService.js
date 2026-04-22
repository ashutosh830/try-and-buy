function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function buildOtpPayload() {
  const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 10);
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  return {
    code: generateOtp(),
    expiresAt
  };
}

module.exports = {
  buildOtpPayload
};
