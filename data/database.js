import mongoose, { mongo } from "mongoose";

export const connectDB=async()=>{
try {
    const {connection}=await mongoose.connect(process.env.MONGO_URI,{
        dbName:"UdemyCourse",
    })
    console.log(`Server Connected to database ${connection.host}`)

} catch (error) {
    console.log("Some error occured",error)
    process.exit(1)
}
}