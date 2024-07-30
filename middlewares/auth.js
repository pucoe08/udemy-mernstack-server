import { User } from "../models/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from 'jsonwebtoken'
import { asyncError } from "./error.js";

export const isAuthenticated = asyncError(
    async (req, res, next) => {
        const { token } = req.cookies;
        // as we r passing error alongwith next hence it will call errorMiddleWare direct nd will skip other middlewre bcz 'err' argument is accepted in errorMiddleware only
        if (!token) {
            return next(new ErrorHandler("Not logged In", 401));
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        //storing user in req object. req object have scope in all the handler in one route
        req.user = await User.findById(decodedData._id);
        next();
    }
)



export const isAdmin = asyncError(async (req, res, next) => {
    if (req.user.role !== "admin") {
        return next(new ErrorHandler("Only Admin allowed", 401));
    }
    next();
}
)