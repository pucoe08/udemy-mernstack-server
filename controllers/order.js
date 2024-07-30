import { asyncError } from "../middlewares/error.js"
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const createOrder = asyncError(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentMethod, paymentInfo, itemsPrice, taxPrice, shippingCharges, totalAmount } = req.body;
    await Order.create({
        shippingInfo,
        orderItems,
        paymentMethod,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingCharges,
        totalAmount,
        user: req.user._id
    })
    for (let i = 0; i < orderItems.length; i++) {
        // Reduce the stock
        const product = await Product.findById(orderItems[i].product);
        product.stock -= orderItems[i].quantity;
        await product.save();
    }

    res.status(201).json({
        success: true,
        message: "Order Placed Successfully"
    })
})

export const getMyOrders = asyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({
        success: true,
        orders
    })
})

export const getAdminOrders = asyncError(async (req, res, next) => {
    const orders = await Order.find();
    res.status(200).json({
        success: true,
        orders
    })
})


export const getOrderDetails = asyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorHandler("Order Not Found", 404));
    res.status(200).json({
        success: true,
        order
    })
})




export const processOrder = asyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorHandler("Order Not Found", 404));
    if (order.orderStatus === "Preparing") {
        order.orderStatus = "Shipped";
    }
    else if (order.orderStatus === "Shipped") {
        order.orderStatus = "Delivered";
        order.deliveredAt = Date.now();
    }
    else return next(new ErrorHandler("Order Already Delivered", 400));
    await order.save();
    res.status(200).json({
        success: true,
        message: "Order Processed Successfully"
    })
})