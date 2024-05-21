const mongoose=require("mongoose");


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    is_admin: {
        type: Boolean,
        default: false 
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
  
});


module.exports = mongoose.model("User",userSchema);