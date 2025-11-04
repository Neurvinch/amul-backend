const mongoose = require("mongoose");

const RegisterSchema  = new mongoose.Schema({
    email: {type: String , required: true, unique: true},
    password: {type: String , required: true},

    name: {type: String , required: true},
    age: {type: Number , required: true},
    bio: {type: String , required: false}
})

module.exports = mongoose.model("register" , RegisterSchema)