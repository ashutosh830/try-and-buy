const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const connectDatabase = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");
const ROLES = require("./constants/roles");

async function seed() {
  await connectDatabase();

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({})
  ]);

  const password = await bcrypt.hash("Password123", 10);

  const [admin, vendor, rider, user] = await User.create([
    {
      name: "Admin One",
      email: "admin@trybuy.com",
      password,
      phone: "9999999991",
      role: ROLES.ADMIN,
      address: "HQ"
    },
    {
      name: "Vendor Vani",
      email: "vendor@trybuy.com",
      password,
      phone: "9999999992",
      role: ROLES.VENDOR,
      address: "Kolkata Market",
      shopName: "Vani Fashion Hub"
    },
    {
      name: "Rider Raj",
      email: "rider@trybuy.com",
      password:"123456678",
      phone: "9999999993",
      role: ROLES.RIDER,
      address: "Rider Base",
      vehicleNumber: "WB20AB1234"
    },
    {
      name: "User Uma",
      email: "user@trybuy.com",
      password,
      phone: "9999999994",
      role: ROLES.USER,
      address: "Salt Lake, Kolkata"
    }
  ]);

  await Cart.create({
    user: user._id,
    items: []
  });

  await Product.create([
    {
      name: "Indigo Linen Kurta",
      description: "Breathable premium kurta for home trial and festival wear.",
      price: 1799,
      images: [
        "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80"
      ],
      category: "Fashion",
      inventoryCount: 12,
      vendor: vendor._id
    },
    {
      name: "Minimal Leather Sneakers",
      description: "Lightweight sneakers with comfort fit and doorstep trial.",
      price: 3299,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
      ],
      category: "Footwear",
      inventoryCount: 8,
      vendor: vendor._id
    },
    {
      name: "Noise-Cancel Headphones",
      description: "Wireless headphones with 30-hour battery and try-first delivery.",
      price: 5499,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
      ],
      category: "Electronics",
      inventoryCount: 5,
      vendor: vendor._id
    }
  ]);

  console.log("Seed complete");
  console.log("Sample logins:");
  console.log("admin@trybuy.com / Password123");
  console.log("vendor@trybuy.com / Password123");
  console.log("rider@trybuy.com / Password123");
  console.log("user@trybuy.com / Password123");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
