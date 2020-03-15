const mongoose = require('mongoose');
const config = require('config');

const MONGO_URI = config.get('MONGO_URI');

mongoose.connect(MONGO_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true
} , (err)=>{
    if(err){
        console.log(err);
    }
    console.log("connected to auth database")
})

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
},{
    timestamps : true
})

const User = mongoose.model("User" , UserSchema);

module.exports = User;