const express=require("express");
const router=express.Router();
router.get("/home",(req,res)=>{
    res.render("nav/home");
    
})
router.get("/about",(req,res)=>{
    res.render("nav/about");

})


module.exports=router;