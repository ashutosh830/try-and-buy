const express=require("express");
const router=express.Router();
const mongoose = require("mongoose");
const Contact=require("../models/contact.js");
router.get("",(req,res)=>{
    res.render("nav/contact.ejs");
})

router.post("",async(req,res)=>{
try {
        const { name, email, message } = req.body;

        const newMessage = new Contact({
            name,
            email,
            message
        });
      

        await newMessage.save();
        res.redirect("nav/home");
    
    

    
        
    } catch (err) {
        console.log(err);
        res.send("Error saving data ❌");
    }

})
module.exports=router;