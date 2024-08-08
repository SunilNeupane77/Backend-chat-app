import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/database.js";
const app=express();
dotenv.config({});



app.listen(process.env.PORT ||4000 ,()=>{
   connectDB();
console.log(`server is running $process.env.PORT`);

})