console.log("in server.js")

import { app } from "./app.js"
import {connectDB} from './data/database.js'
import cloudinary from "cloudinary"

connectDB();
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
// we dont need to import 'process.env' variable this is loaded when derver starts
app.listen(process.env.PORT,()=>{
console.log(`Server is listening on port: ${process.env.PORT} , in ${process.env.NODE_ENV} mode`)
});