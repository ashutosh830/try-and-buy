// const express=require("express");
// const router=express.Router();
// const mongoose=require("mongoose");
// const Product=require("../models/products.js")
// const isLoggedIn = require("../middleware/auth");


// router.get("/addproducts",(req,res)=>{
//        res.render("products/addproduct.ejs");
// })


// router.post("/addproducts",isLoggedIn,async(req,res)=>{
//     const{name,price,category,description,image}=req.body;
//     const newProduct=new Product({
//         name,price,category,description,image
//     });
//  await newProduct.save();
//    const products=await Product.find();

//    res.redirect("/vendor/dashboard");


// })
// router.get("/dashboard", async (req, res) => {
//     const details = req.user;

//     // sirf current vendor ke products lao
//     const products = await Product.find({ vendorId: req.user._id });

//     res.render("vendor/vendordash.ejs", {
//         info: details,
//         products: products   // 🔥 ye bhejna zaroori hai
//     });
// });

// module.exports=router;