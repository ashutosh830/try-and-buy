function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    address: user.address,
    shopName: user.shopName,
    vehicleNumber: user.vehicleNumber,
    isActive: user.isActive,
    createdAt: user.createdAt
  };
}

module.exports = sanitizeUser;
