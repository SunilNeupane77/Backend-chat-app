import mongoose from "mongoose";

const messageModel= new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    reciverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        require:true
    }
},{
    timestamps:true
})

export const Message=mongoose.model("Message",messageModel);