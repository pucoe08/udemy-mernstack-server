import express from "express";
// dotenv is library which provides variable 'process.env'. this variable stores different varables defined in config.env & details about machine
import {config} from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config({path:'./data/config.env'});
export const app=express();

//using Middlewares
app.use(express.json()); // this will parse json object
app.use(cookieParser()); // will parse cookie
app.use(cors({
    origin: [process.env.FRONTEND_URI_1,process.env.FRONTEND_URI_2],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

// default route
app.get("/",(req, res, next)=>{
res.send("working")
})

//Importing Routes Here
import user from "./routes/user.js";
import product from "./routes/product.js";
import order from "./routes/order.js";

app.use("/api/v1/user",user);  
app.use("/api/v1/product",product);  
app.use("/api/v1/order",order);  

// Using Error Middleware // next is used to call that middleware
app.use(errorMiddleware)