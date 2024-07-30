import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Email"],
        unique: [true, "Email Already Exists"],
        validate: validator.isEmail,
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"],
        minLength: [6, "Password must be atleast 6 characters long"],
        select: false,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    pinCode: {
        type: Number,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    avatar: {
        public_id: String,
        url: String
    },
    otp: Number,
    otp_expire: Date
});

// below method automatically invoked whenever we type user.save()
schema.pre("save", async function (next) {
    //schema is a object nd we r accessing property password using "this"
    if (!this.isModified("password")) {
       return next()
    }
    // 10 defines how strong encrytion is, more encryption more time it will take 
    this.password = await bcrypt.hash(this.password, 10);
})

// created method of schema
schema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

schema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "15d"
    })
}
export const User = mongoose.model("User", schema);