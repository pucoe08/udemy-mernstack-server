import express from "express";
import { getMyProfile, login, logOut, signup, changePassword, updateProfile, updatePic, forgetPassword, resetPassword } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();

// login, signup r called handlers
router.post("/login", login)
router.post("/new", singleUpload, signup)
// first 'isAuthenticated' HANDLER will be called than using 'next' getMyProfile will be called
// isAuthenticated can be called middleware
// when we execute 'next' in last handler i.e. 'getMyProfile' than it will execute middleware in app.js which is 'errorMiddleware'
router.get("/me", isAuthenticated, getMyProfile)
router.get("/logout", isAuthenticated, logOut)

//Updating Routes
router.put("/updateprofile", isAuthenticated, updateProfile)
router.put("/changepassword", isAuthenticated, changePassword)
router.put("/updatepic", isAuthenticated,singleUpload, updatePic)

//wr r using route instead of direct put or post. here we need 2 methods with one request post is for otp and put for changing password with same url 
router.route("/forgetpassword").post(forgetPassword).put(resetPassword);

export default router; 