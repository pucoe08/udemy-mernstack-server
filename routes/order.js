import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import { createOrder, getAdminOrders, getMyOrders, getOrderDetails, processOrder } from "../controllers/order.js";

const router = express.Router();



router.post("/new", isAuthenticated, createOrder);
router.get("/my", isAuthenticated, getMyOrders);
router.get("/admin", isAuthenticated, isAdmin,getAdminOrders);

router.route("/single/:id")
    .get(isAuthenticated, getOrderDetails)
    .put(isAuthenticated,isAdmin,processOrder);
export default router;