import mongoose from "mongoose";

const userModel=new mongoose.Schema({
    fullName:{
      type:String,
      required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profilePhoto:{
        type:String,
        default:""
    },
    gender:{
        type:String,
        enum:["male","female","others"],
        required:true
    }
})

export const User=mongoose.model("User",userModel);