const jwt = require("jsonwebtoken");

function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role
    },
    process.env.JWT_SECRET || "change-me",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    }
  );
}

module.exports = {
  signToken
};
