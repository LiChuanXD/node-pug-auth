const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {type : String},
    email : {type : String},
    password : {type : String},
    fbId : {type : String},
    fbToken : {type : String}
},{
    timestamps : true
})

const User = mongoose.model("User" , UserSchema);

module.exports = User;