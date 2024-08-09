import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/database.js";
import messageRoute from "./routes/messageRoute.js";
import userRoute from "./routes/userRoute.js";
const app = express();
dotenv.config({});

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message",messageRoute);


app.listen(process.env.PORT || 4000, () => {
  connectDB();
  console.log(`server is running ${process.env.PORT}`);
});
