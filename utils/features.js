import DataUriParser from "datauri/parser.js"
import path from "path";
import { createTransport } from "nodemailer";

export const getDataUri = (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString()
    return parser.format(extName, file.buffer)
}



export const sendToken = (user, res, message, statusCode) => {
    const token = user.generateToken();
    res.status(statusCode)
        // we r sending token to cookie in response which expires in 15 days 
        .cookie("token", token, {
            ...cookieOptions,
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        })
        // we r sending json object in response as well
        .json({
            success: true,
            message: message,
        })
}

export const cookieOptions = {
    // if 'secure' true than it will not work with postman if false it will not work with frontend
    secure: process.env.NODE_ENV === "Development" ? false : true,
    httpOnly: process.env.NODE_ENV === "Development" ? false : true,
    // 'sameSite can be 'none', 'lax', 'strict'
    sameSite: process.env.NODE_ENV === "Development" ? false : "none",
}



export const sendEmail = async (subject, to, text) => {
    const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })
    await transporter.sendMail({ to, subject, text })

}