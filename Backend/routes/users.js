const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const User=require("../models/user.js");
const passport=require("passport");
const { route } = require("./vendor.js");


router.get("/login",(req,res)=>{
    res.render("users/user.ejs");
})

router.post("/login",passport.authenticate("user-local",{failureRedirect:"/login"
    ,failureFlash:true}),async(req,res)=>{
        res.send("you are logged in");
        
    })


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})
router.post("/signup",async(req,res)=>{
    try {
    const{name,phone,email,country,password}=req.body;
    const newUser= new User({
        username:email,
        name,
        phone,
        email,
        country,
        
    

    });
    await User.register(newUser,password);
    res.redirect("/user/login");

}catch(err){
    console.log(err);
    res.redirect("/user/signup");
}

})
module.exports=router;