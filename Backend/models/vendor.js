const mongoose=require("mongoose");
const passportLocalMongoos=require("passport-local-mongoose").default;

const vendSchema=new mongoose.Schema({
    vendorName:{
        type:String,
        required:true
    },
    shopName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        minlength:10
    },
    address:{
        type:String,
        required:true

    },
   
    createdAt: {
        type: Date,
        default: Date.now
    }
});
vendSchema.plugin(passportLocalMongoos);
const Vendor=mongoose.model("Vendor",vendSchema);
module.exports=Vendor;