const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    description: String,
    image: String,

    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;