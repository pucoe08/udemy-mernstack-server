import { asyncError } from "../middlewares/error.js"
import { Product } from "../models/product.js"
import { Category } from "../models/category.js"
import ErrorHandler from "../utils/ErrorHandler.js"
import { getDataUri } from "../utils/features.js"
import cloudinary from "cloudinary"


export const getAllproducts = asyncError(async (req, res, next) => {
    //Search & Category Query
    const { keyword, category } = req.query
    const products = await Product.find({
        name: {
            // regex look for patteren like search 'ook' it can give macbook
            $regex: keyword ? keyword : '',
            $options: 'i',  // case insenstive
        },
        category: category ? category : undefined
    })
    res.status(200).json({
        success: true,
        products,
    })

})

export const getAdminProducts = asyncError(async (req, res, next) => {
    // populate("category") will populate category details from category table also
    const products = await Product.find({}).populate("category");
    const outOfStock = products.filter((i) => i.stock === 0);
    res.status(200).json({
        success: true,
        products,
        outOfStock: outOfStock.length,
        instock: products.length - outOfStock.length,
    })

})

export const getProductDetails = asyncError(async (req, res, next) => {
    //Search & Category Query

    const product = await Product.findById(req.params.id).populate("category");;

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    res.status(200).json({
        success: true,
        product,
    })

})

export const createProduct = asyncError(async (req, res, next) => {
    const { name, description, price, category, stock } = req.body;
    if (!req.file) {
        return next(new ErrorHandler("Please upload a Image", 400))
    }
    const file = getDataUri(req.file);
    const myCloud = await cloudinary.v2.uploader.upload(file.content);
    const image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
    };
    const product = await Product.create({
        name, description, price, category, stock, images: [image]
    })
    res.status(200).json({
        success: true,
        message: "Product Created Successfully",
    })

})


export const updateProduct = asyncError(async (req, res, next) => {
    const { name, description, price, category, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;

    await product.save();

    res.status(200).json({
        success: true,
        message: "Product Updated Successfully",
    })

})

export const addProductImage = asyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    if (!req.file) {
        return next(new ErrorHandler("Please Add Image", 400))
    }

    const file = getDataUri(req.file);
    const myCloud = await cloudinary.v2.uploader.upload(file.content);
    const image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
    };

    product.images.push(image);
    await product.save();

    res.status(200).json({
        success: true,
        message: "Product Image Added Successfully",
    })

})

export const deleteProductImage = asyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }
    const id = req.query.id;
    if (!id) return next(new ErrorHandler("Please Enter Image Id ", 400))

    let isExist = -1;

    product.images.forEach((item, index) => {
        if (item._id.toString() === id.toString()) {
            isExist = index;
        }
    })

    if (isExist < 0) {
        return next(new ErrorHandler("Image Does Not Exist", 400))
    }

    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
    product.images.splice(isExist, 1);
    await product.save();
    res.status(200).json({
        success: true,
        message: "Product Image Deleted Successfully",
    })

})

export const deleteProduct = asyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    for (let index = 0; index < product.images.length; index++) {
        await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }

    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: "Product  Deleted Successfully",
    })

})

export const addCategory = asyncError(async (req, res, next) => {
    const { category } = req.body;
    await Category.create({ category })
    res.status(201).json({
        success: true,
        message: "Category  Added Successfully",
    })

})


export const getAllCategories = asyncError(async (req, res, next) => {
    const categories = await Category.find({});
    res.status(200).json({
        success: true,
        categories,
    })
})


export const deleteCategory = asyncError(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return next(new ErrorHandler("Category Not Found", 404))
    }
    // deleteing category in all products related to category
    const products = await Product.find({ category: category._id })

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        product.category = undefined;
        await product.save();
    }

    await category.deleteOne();
    res.status(200).json({
        success: true,
        message: "Category  Deleted Successfully",
    })


})