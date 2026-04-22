const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose').default;


const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    country: {
        type: String,
        required: true
    },

    // password: {
    //     type: String,
    //     required: true,
    //     minlength: 6
    // },

    createdAt: {
        type: Date,
        default: Date.now
    }

});
userSchema.plugin(passportLocalMongoose);

// Model Create
const User = mongoose.model("User", userSchema);

module.exports = User;