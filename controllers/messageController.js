import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
export const sendMessage=async (req,res)=>{
    try {
        const senderId=req.id;
        const recieverId=req.params.id;

        const {message}=req.body;
        let gotConversation=await Conversation.findOne({
            participants:{$all:[senderId,recieverId]}
        });
        if(!gotConversation){
            gotConversation=await Conversation.create({
                participants:[senderId,recieverId]
            });
        }

        const newMessage=await Message.create({
          senderId,
          reciverId,
          message
        })
        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        }
    
        await Promise.all([gotConversation.save(),newMessage.save()]);
        // socket io
       const reciverSocketId=getReceiverSocketId(recieverId);
       if(reciverSocketId){
        io.to(reciverSocketId).emit("newMessage",newMessage);
       }

        return res.status(201).json({
            message:"message send Successfully"
        })
        
    } catch (error) {
        console.log(error);
        
    }
};
export const getMessage=async(req,res)=>{
    try {
        const reciverId=req.params.id;
        const senderId=req.id;
        const conversation=await Conversation.findOne({
          participants:{$all:[senderId,reciverId]}
        }).populate("messages");
        return res.status(200).json(conversation?.messages);
    } catch (error) {
        console.log(error);
        
    }
}