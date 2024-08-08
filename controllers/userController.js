import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const register=async(req,res)=>{
    try {
        const {fullName,userName,password,confirmPassword,gender,profilePhoto}=req.body;
        if(!fullName||!userName||!password||!confirmPassword||!gender){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password!=confirmPassword){
            return res.status(400).json({message:"Password do not match"});
        }
         const user=await User.findOne({userName});
         if(user){
            return res.status(400).json({message:"Username already exist"});
         }

         const hashPassword=await bcrypt.hash(password,10);

         // profile photo
         const maleProfile=`https://avatar.iran.liara.run/public/boy?userName=${userName}`;
         const femeleProfile=`https://avatar.iran.liara.run/public/girl?userName=${userName}`;




         await User.create({
            fullName,
            userName,
            password:hashPassword,
            profilePhoto:gender==="male"?maleProfile:femeleProfile,
            gender
         });

         return res.status(201).json({
            message:"Account created successfully",
            success:true
         })
    } catch (error) {
        console.log(error);
        
    }
}

export const login=async(req,res)=>{
    try {
        const {userName,password}=req.body;
        if(!userName||!password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user=await User.findOne(userName);
        if(!user){
            return res.status(400).json({
                message:"Incorrect name or password",
                success:false
            })
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json(
                {
                    message:"Incorrect username or password",
                    success:false
                }
            )
        };
        const tokenData={
            userId:user._id
        };
        const token=await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn:'1d'});
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpOnly:true,saneSite:"strict"}).json({
            _id:user._id,
            userName:user.userName,
            fullName:user.fullName,
            profilePhoto:user.profilePhoto
        });


    } catch (error) {
        console.log(error);
        
    }
}

export const logout=(req,res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out successfully",
        })
    } catch (error) {
        console.log(error);
        
    }
};

export const getOtherUsers=async(req,res)=>{
    try {
        const loggedInUserId=req.id;
        const otherUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        return res.status(200).json(otherUsers);
        
    } catch (error) {
        console.log(error);
        
    }
}