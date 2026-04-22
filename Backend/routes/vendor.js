const express = require("express");
const router = express.Router();
const Product = require("../models/products.js");
const Vendor = require("../models/vendor");
const passport = require("passport");
const isLoggedIn = require("../middleware/auth");

// ================= LOGIN =================
router.get("/login",(req,res)=>{
    res.render("vendor/vendlogin.ejs");
});

router.post("/login",
    passport.authenticate("vendor-local"),
    (req,res)=>{
        res.redirect("/vendor/dashboard");
});

// ================= SIGNUP =================
router.get("/signup",(req,res)=>{
    res.render("vendor/vendsignup.ejs");
});

router.post("/signup",async(req,res)=>{
    try{
        const {vendorName,shopName,email,phone,address,password} = req.body;

        const newVendor = new Vendor({
            username: email,
            vendorName,
            email,
            shopName,
            phone,
            address
        });

        await Vendor.register(newVendor,password);
        res.redirect("/vendor/login");

    }catch(err){
        console.log(err);
        res.send("failed");
    }
});

// ================= LOGOUT =================
router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            console.log(err);
        } else {
            res.redirect("/vendor/login");
        }
    });
});

// ================= ADD PRODUCT =================
router.get("/addproducts", isLoggedIn,(req,res)=>{
    res.render("products/addproduct.ejs");
});

router.post("/addproducts", isLoggedIn, async(req,res)=>{
    const {name,price,category,description,image} = req.body;

    const newProduct = new Product({
        name,
        price,
        category,
        description,
        image,
        vendorId: req.user._id   // 🔥 VERY IMPORTANT
    });

    await newProduct.save();

    res.redirect("/vendor/dashboard");
});

// ================= DASHBOARD =================
router.get("/dashboard", isLoggedIn, async (req, res) => {

    const products = await Product.find({ vendorId: req.user._id });

    res.render("vendor/vendordash.ejs", {
        info: req.user,
        products: products
    });
});

module.exports = router;